package com.mathsmaster.kids.data

import android.content.Context
import com.mathsmaster.kids.model.ClassLevel
import com.mathsmaster.kids.model.Difficulty
import com.mathsmaster.kids.model.QuizSummary
import com.mathsmaster.kids.model.UserProgress
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class ProgressRepository(context: Context) {

    private val prefs = context.getSharedPreferences("maths_master_kids_prefs", Context.MODE_PRIVATE)

    private fun todayKey(): String {
        val formatter = SimpleDateFormat("yyyy-MM-dd", Locale.US)
        return formatter.format(Date())
    }

    fun loadProgress(): UserProgress {
        val today = todayKey()
        val lastDaily = prefs.getString(KEY_LAST_DAILY_DATE, "") ?: ""
        val classNum = prefs.getInt(KEY_SELECTED_CLASS, 1)
        val diffName = prefs.getString(KEY_SELECTED_DIFFICULTY, Difficulty.EASY.name) ?: Difficulty.EASY.name

        return UserProgress(
            totalStars = prefs.getInt(KEY_TOTAL_STARS, 0),
            totalQuizzesCompleted = prefs.getInt(KEY_TOTAL_QUIZZES, 0),
            totalCorrectAnswers = prefs.getInt(KEY_TOTAL_CORRECT, 0),
            totalAttemptedQuestions = prefs.getInt(KEY_TOTAL_ATTEMPTED, 0),
            dailyStreak = prefs.getInt(KEY_DAILY_STREAK, 0),
            lastDailyDate = lastDaily,
            dailyCompletedToday = lastDaily == today,
            selectedClass = ClassLevel.entries.firstOrNull { it.number == classNum } ?: ClassLevel.CLASS_1,
            selectedDifficulty = Difficulty.entries.firstOrNull { it.name == diffName } ?: Difficulty.EASY,
            soundEnabled = prefs.getBoolean(KEY_SOUND_ENABLED, true)
        )
    }

    fun saveSelection(classLevel: ClassLevel, difficulty: Difficulty) {
        prefs.edit()
            .putInt(KEY_SELECTED_CLASS, classLevel.number)
            .putString(KEY_SELECTED_DIFFICULTY, difficulty.name)
            .apply()
    }

    fun saveSoundEnabled(enabled: Boolean) {
        prefs.edit()
            .putBoolean(KEY_SOUND_ENABLED, enabled)
            .apply()
    }

    fun recordQuizResult(summary: QuizSummary): UserProgress {
        val current = loadProgress()
        val today = todayKey()
        val nextStars = current.totalStars + summary.starsEarned
        val nextQuizzes = current.totalQuizzesCompleted + 1
        val nextCorrect = current.totalCorrectAnswers + summary.correctAnswers
        val nextAttempted = current.totalAttemptedQuestions + summary.totalQuestions

        var nextStreak = current.dailyStreak
        var nextLastDaily = current.lastDailyDate
        if (summary.config.isDailyPractice && current.lastDailyDate != today) {
            nextStreak += 1
            nextLastDaily = today
        }

        prefs.edit()
            .putInt(KEY_TOTAL_STARS, nextStars)
            .putInt(KEY_TOTAL_QUIZZES, nextQuizzes)
            .putInt(KEY_TOTAL_CORRECT, nextCorrect)
            .putInt(KEY_TOTAL_ATTEMPTED, nextAttempted)
            .putInt(KEY_DAILY_STREAK, nextStreak)
            .putString(KEY_LAST_DAILY_DATE, nextLastDaily)
            .apply()

        return loadProgress()
    }

    fun resetProgress(): UserProgress {
        prefs.edit().clear().apply()
        return loadProgress()
    }

    private companion object {
        const val KEY_TOTAL_STARS = "total_stars"
        const val KEY_TOTAL_QUIZZES = "total_quizzes"
        const val KEY_TOTAL_CORRECT = "total_correct"
        const val KEY_TOTAL_ATTEMPTED = "total_attempted"
        const val KEY_DAILY_STREAK = "daily_streak"
        const val KEY_LAST_DAILY_DATE = "last_daily_date"
        const val KEY_SELECTED_CLASS = "selected_class"
        const val KEY_SELECTED_DIFFICULTY = "selected_difficulty"
        const val KEY_SOUND_ENABLED = "sound_enabled"
    }
}
