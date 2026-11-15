package com.mathsmaster.kids.audio

import android.media.AudioManager
import android.media.ToneGenerator

object SoundPlayer {
    var enabled: Boolean = true

    fun playCorrect() {
        playTone(ToneGenerator.TONE_PROP_ACK, 150)
    }

    fun playIncorrect() {
        playTone(ToneGenerator.TONE_PROP_NACK, 160)
    }

    fun playClick() {
        playTone(ToneGenerator.TONE_PROP_BEEP, 50)
    }

    private fun playTone(tone: Int, durationMs: Int) {
        if (!enabled) return
        try {
            val generator = ToneGenerator(AudioManager.STREAM_MUSIC, 65)
            generator.startTone(tone, durationMs)
        } catch (_: Throwable) {
            // Safely ignore on devices without audio output
        }
    }
}
