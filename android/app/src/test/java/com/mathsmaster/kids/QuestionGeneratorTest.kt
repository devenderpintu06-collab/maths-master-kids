package com.mathsmaster.kids

import com.mathsmaster.kids.logic.QuestionGenerator
import com.mathsmaster.kids.model.ClassLevel
import com.mathsmaster.kids.model.Difficulty
import com.mathsmaster.kids.model.MathOperation
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import kotlin.random.Random

class QuestionGeneratorTest {

    @Test
    fun generatesTenQuestionsWithFourUniqueValidOptions() {
        val random = Random(42)
        for (level in ClassLevel.entries) {
            for (diff in Difficulty.entries) {
                for (op in MathOperation.entries) {
                    val quiz = QuestionGenerator.generateQuiz(level, diff, op, 10, random)
                    assertEquals(10, quiz.size)
                    for (q in quiz) {
                        assertEquals(4, q.options.distinct().size)
                        assertTrue(q.options.contains(q.correctAnswer))
                        when (q.operation) {
                            MathOperation.ADDITION -> assertEquals(q.operandA + q.operandB, q.correctAnswer)
                            MathOperation.SUBTRACTION -> {
                                assertTrue(q.operandA >= q.operandB)
                                assertEquals(q.operandA - q.operandB, q.correctAnswer)
                            }
                            MathOperation.MULTIPLICATION -> assertEquals(q.operandA * q.operandB, q.correctAnswer)
                            MathOperation.DIVISION -> {
                                assertTrue(q.operandB > 0)
                                assertEquals(0, q.operandA % q.operandB)
                                assertEquals(q.operandA / q.operandB, q.correctAnswer)
                            }
                        }
                    }
                }
            }
        }
    }

    @Test
    fun dailyPracticeMixesAllFourOperations() {
        val quiz = QuestionGenerator.generateQuiz(
            classLevel = ClassLevel.CLASS_3,
            difficulty = Difficulty.MEDIUM,
            operation = null,
            questionCount = 10,
            random = Random(7)
        )
        assertEquals(10, quiz.size)
        val opsUsed = quiz.map { it.operation }.toSet()
        assertEquals(MathOperation.entries.toSet(), opsUsed)
    }
}
