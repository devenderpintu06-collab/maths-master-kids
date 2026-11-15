package com.mathsmaster.kids.model

enum class MathOperation(
    val title: String,
    val symbol: String,
    val colorHex: Long
) {
    ADDITION("Addition", "+", 0xFF10B981),
    SUBTRACTION("Subtraction", "−", 0xFF2563EB),
    MULTIPLICATION("Multiplication", "×", 0xFFF59E0B),
    DIVISION("Division", "÷", 0xFF8B5CF6)
}

enum class ClassLevel(val number: Int, val label: String) {
    CLASS_1(1, "Class 1"),
    CLASS_2(2, "Class 2"),
    CLASS_3(3, "Class 3"),
    CLASS_4(4, "Class 4"),
    CLASS_5(5, "Class 5")
}

enum class Difficulty(val label: String) {
    EASY("Easy"),
    MEDIUM("Medium"),
    HARD("Hard")
}

data class MathQuestion(
    val id: String,
    val operandA: Int,
    val operandB: Int,
    val operation: MathOperation,
    val correctAnswer: Int,
    val options: List<Int>,
    val hint: String
) {
    val equationText: String
        get() = "$operandA ${operation.symbol} $operandB = ?"
}

data class QuizConfig(
    val classLevel: ClassLevel,
    val difficulty: Difficulty,
    val operation: MathOperation?, // null means Daily Practice (all 4 operations mixed)
    val isDailyPractice: Boolean = false
)

data class QuizSummary(
    val config: QuizConfig,
    val totalQuestions: Int,
    val correctAnswers: Int,
    val incorrectAnswers: Int,
    val starsEarned: Int,
    val percentage: Int
)

data class UserProgress(
    val totalStars: Int = 0,
    val totalQuizzesCompleted: Int = 0,
    val totalCorrectAnswers: Int = 0,
    val totalAttemptedQuestions: Int = 0,
    val dailyStreak: Int = 0,
    val lastDailyDate: String = "",
    val dailyCompletedToday: Boolean = false,
    val selectedClass: ClassLevel = ClassLevel.CLASS_1,
    val selectedDifficulty: Difficulty = Difficulty.EASY,
    val soundEnabled: Boolean = true
)
