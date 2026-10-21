package com.appfactory.modellbaulog.nativecore

import android.app.Application
import android.graphics.Bitmap
import android.net.Uri
import expo.modules.kotlin.Promise
import java.io.File
import org.junit.Assert.*
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.RuntimeEnvironment
import org.robolectric.annotation.Config
import org.robolectric.annotation.GraphicsMode

@RunWith(RobolectricTestRunner::class)
@Config(sdk = [35], application = Application::class)
@GraphicsMode(GraphicsMode.Mode.NATIVE)
class PhotoFilesTest {
    private val context get() = RuntimeEnvironment.getApplication()

    @Test fun legacyBackupFixtureContainsAnAndroidReadablePhoto() {
        val photo = File(context.cacheDir, "legacy-backup-photo.jpg")
        requireNotNull(javaClass.getResourceAsStream("/legacy-backup-photo.jpg")).use { input ->
            photo.outputStream().use { input.copyTo(it) }
        }
        validatePhoto(photo)
    }

    @Test fun decoderAcceptsJpegAndRejectsBrokenOrOversizedImages() {
        val valid = File(context.cacheDir, "valid.jpg")
        val bitmap = Bitmap.createBitmap(16, 16, Bitmap.Config.ARGB_8888)
        valid.outputStream().use { assertTrue(bitmap.compress(Bitmap.CompressFormat.JPEG, 88, it)) }
        bitmap.recycle()
        validatePhoto(valid)
        val broken = File(context.cacheDir, "broken.jpg").apply {
            writeBytes(byteArrayOf(0xff.toByte(), 0xd8.toByte(), 0, 0))
        }
        assertThrows(IllegalArgumentException::class.java) { validatePhoto(broken) }
        val large = File(context.cacheDir, "large.jpg")
        val wide = Bitmap.createBitmap(1921, 1, Bitmap.Config.ARGB_8888)
        large.outputStream().use { assertTrue(wide.compress(Bitmap.CompressFormat.JPEG, 88, it)) }
        wide.recycle()
        assertThrows(IllegalArgumentException::class.java) { validatePhoto(large) }
    }

    @Test fun nativeAccessIsRestrictedToNonemptyPrivateFiles() {
        val valid = File(context.filesDir, "original.mlbackup").apply { writeBytes(byteArrayOf(1, 2, 3)) }
        assertEquals(valid.canonicalFile, privateFile(context, Uri.fromFile(valid).toString()))
        val empty = File(context.cacheDir, "empty.jpg").apply { writeBytes(byteArrayOf()) }
        assertThrows(IllegalArgumentException::class.java) { privateFile(context, Uri.fromFile(empty).toString()) }
        assertThrows(IllegalArgumentException::class.java) { privateFile(context, "content://documents/example") }
        val outside = File(context.filesDir.parentFile, "outside.jpg").apply { writeBytes(byteArrayOf(1)) }
        assertThrows(IllegalArgumentException::class.java) { privateFile(context, Uri.fromFile(outside).toString()) }
        assertThrows(IllegalArgumentException::class.java) { privateFile(context, "file://${context.filesDir}/../outside.jpg") }
    }

    private class Result : Promise {
        var completions = 0
        var value: Any? = null
        var error: String? = null
        override fun resolve(value: Any?) { completions++; this.value = value }
        override fun reject(code: String?, message: String?, cause: Throwable?) { completions++; error = code }
    }

    @Test fun duplicateSaveCallbacksAndCancellationPreserveThePreparedBackup() {
        val source = File(context.cacheDir, "encrypted.mlbackup").apply { writeBytes(byteArrayOf(8, 7, 6)) }
        val result = Result()
        assertTrue(SaveDocumentActivity.begin("one", SaveDocumentActivity.Pending(source, source.name, result)))
        assertFalse(SaveDocumentActivity.begin("two", SaveDocumentActivity.Pending(source, source.name, Result())))
        assertNotNull(SaveDocumentActivity.takeForWrite("one"))
        assertNull(SaveDocumentActivity.takeForWrite("one"))
        assertNull(SaveDocumentActivity.takeForWrite("orphan"))
        SaveDocumentActivity.finish("one", false)
        SaveDocumentActivity.finish("one", true)
        SaveDocumentActivity.finish("orphan", false)
        assertEquals(1, result.completions)
        assertEquals("cancelled", (result.value as Map<*, *>)["status"])
        assertArrayEquals(byteArrayOf(8, 7, 6), source.readBytes())
        assertTrue(SaveDocumentActivity.begin("retry", SaveDocumentActivity.Pending(source, source.name, result)))
        SaveDocumentActivity.finish("retry", false, "Synthetic failure")
        assertEquals("SAVE_FAILED", result.error)
        assertTrue(source.exists())
    }
}
