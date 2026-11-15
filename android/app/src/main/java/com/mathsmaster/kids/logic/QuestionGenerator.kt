package com.mathsmaster.kids.logic

import com.mathsmaster.kids.model.ClassLevel
import com.mathsmaster.kids.model.Difficulty
import com.mathsmaster.kids.model.MathOperation
import com.mathsmaster.kids.model.MathQuestion
import kotlin.math.max
import kotlin.random.Random

object QuestionGenerator {

    fun generateQuiz(
        classLevel: ClassLevel,
        difficulty: Difficulty,
        operation: MathOperation?,
        questionCount: Int = 10,
        random: Random = Random.Default
    ): List<MathQuestion> {
        val operations = MathOperation.entries
        return List(questionCount) { index ->
            val op = operation ?: operations[index % operations.size]
            generateQuestion(
                index = index,
                classLevel = classLevel,
                difficulty = difficulty,
                operation = op,
                random = random
            )
        }
    }

    fun generateQuestion(
        index: Int,
        classLevel: ClassLevel,
        difficulty: Difficulty,
        operation: MathOperation,
        random: Random = Random.Default
    ): MathQuestion {
        val (a, b, answer, hint) = when (operation) {
            MathOperation.ADDITION -> generateAddition(classLevel, difficulty, random)
            MathOperation.SUBTRACTION -> generateSubtraction(classLevel, difficulty, random)
            MathOperation.MULTIPLICATION -> generateMultiplication(classLevel, difficulty, random)
            MathOperation.DIVISION -> generateDivision(classLevel, difficulty, random)
        }

        val options = buildFourUniqueOptions(answer, operation, random)
        return MathQuestion(
            id = "${operation.name}_${classLevel.number}_${difficulty.name}_$index",
            operandA = a,
            operandB = b,
            operation = operation,
            correctAnswer = answer,
            options = options,
            hint = hint
        )
    }

    private data class GeneratedTuple(
        val a: Int,
        val b: Int,
        val answer: Int,
        val hint: String
    )

    private fun generateAddition(
        classLevel: ClassLevel,
        difficulty: Difficulty,
        random: Random
    ): GeneratedTuple {
        val (minVal, maxVal) = when (classLevel) {
            ClassLevel.CLASS_1 -> when (difficulty) {
                Difficulty.EASY -> 1 to 9
                Difficulty.MEDIUM -> 4 to 15
                Difficulty.HARD -> 10 to 25
            }
            ClassLevel.CLASS_2 -> when (difficulty) {
                Difficulty.EASY -> 10 to 30
                Difficulty.MEDIUM -> 15 to 55
                Difficulty.HARD -> 25 to 95
            }
            ClassLevel.CLASS_3 -> when (difficulty) {
                Difficulty.EASY -> 20 to 90
                Difficulty.MEDIUM -> 50 to 250
                Difficulty.HARD -> 120 to 490
            }
            ClassLevel.CLASS_4 -> when (difficulty) {
                Difficulty.EASY -> 100 to 450
                Difficulty.MEDIUM -> 250 to 950
                Difficulty.HARD -> 500 to 2500
            }
            ClassLevel.CLASS_5 -> when (difficulty) {
                Difficulty.EASY -> 250 to 1200
                Difficulty.MEDIUM -> 800 to 4500
                Difficulty.HARD -> 1500 to 9999
            }
        }
        val a = random.nextInt(minVal, maxVal + 1)
        val b = random.nextInt(minVal, maxVal + 1)
        val ans = a + b
        return GeneratedTuple(
            a = a,
            b = b,
            answer = ans,
            hint = "Start at $a and count forward by $b."
        )
    }

    private fun generateSubtraction(
        classLevel: ClassLevel,
        difficulty: Difficulty,
        random: Random
    ): GeneratedTuple {
        val (minB, maxB, minDiff, maxDiff) = when (classLevel) {
            ClassLevel.CLASS_1 -> when (difficulty) {
                Difficulty.EASY -> listOf(1, 5, 1, 8)
                Difficulty.MEDIUM -> listOf(2, 9, 2, 12)
                Difficulty.HARD -> listOf(5, 15, 3, 20)
            }
            ClassLevel.CLASS_2 -> when (difficulty) {
                Difficulty.EASY -> listOf(5, 20, 5, 25)
                Difficulty.MEDIUM -> listOf(10, 45, 10, 50)
                Difficulty.HARD -> listOf(15, 75, 12, 85)
            }
            ClassLevel.CLASS_3 -> when (difficulty) {
                Difficulty.EASY -> listOf(15, 80, 15, 95)
                Difficulty.MEDIUM -> listOf(40, 200, 40, 250)
                Difficulty.HARD -> listOf(100, 450, 80, 500)
            }
            ClassLevel.CLASS_4 -> when (difficulty) {
                Difficulty.EASY -> listOf(80, 350, 80, 450)
                Difficulty.MEDIUM -> listOf(200, 800, 150, 950)
                Difficulty.HARD -> listOf(400, 2000, 300, 2500)
            }
            ClassLevel.CLASS_5 -> when (difficulty) {
                Difficulty.EASY -> listOf(200, 1000, 200, 1200)
                Difficulty.MEDIUM -> listOf(600, 3500, 500, 4500)
                Difficulty.HARD -> listOf(1200, 7500, 800, 8500)
            }
        }
        val b = random.nextInt(minB, maxB + 1)
        val diff = random.nextInt(minDiff, maxDiff + 1)
        val a = b + diff // Guarantees a >= b and non-negative integer answer
        return GeneratedTuple(
            a = a,
            b = b,
            answer = diff,
            hint = "Think: what plus $b equals $a?"
        )
    }

    private fun generateMultiplication(
        classLevel: ClassLevel,
        difficulty: Difficulty,
        random: Random
    ): GeneratedTuple {
        val (aRange, bRange) = when (classLevel) {
            ClassLevel.CLASS_1 -> when (difficulty) {
                Difficulty.EASY -> (1 to 4) to (1 to 3)
                Difficulty.MEDIUM -> (2 to 5) to (2 to 5)
                Difficulty.HARD -> (2 to 6) to (3 to 6)
            }
            ClassLevel.CLASS_2 -> when (difficulty) {
                Difficulty.EASY -> (2 to 5) to (2 to 6)
                Difficulty.MEDIUM -> (2 to 8) to (2 to 6)
                Difficulty.HARD -> (3 to 10) to (3 to 8)
            }
            ClassLevel.CLASS_3 -> when (difficulty) {
                Difficulty.EASY -> (2 to 9) to (2 to 6)
                Difficulty.MEDIUM -> (3 to 10) to (3 to 10)
                Difficulty.HARD -> (4 to 12) to (4 to 12)
            }
            ClassLevel.CLASS_4 -> when (difficulty) {
                Difficulty.EASY -> (6 to 12) to (3 to 9)
                Difficulty.MEDIUM -> (11 to 25) to (3 to 9)
                Difficulty.HARD -> (15 to 45) to (4 to 12)
            }
            ClassLevel.CLASS_5 -> when (difficulty) {
                Difficulty.EASY -> (12 to 35) to (4 to 12)
                Difficulty.MEDIUM -> (20 to 65) to (6 to 15)
                Difficulty.HARD -> (25 to 95) to (11 to 25)
            }
        }
        val a = random.nextInt(aRange.first, aRange.second + 1)
        val b = random.nextInt(bRange.first, bRange.second + 1)
        return GeneratedTuple(
            a = a,
            b = b,
            answer = a * b,
            hint = "Add $a together $b times."
        )
    }

    private fun generateDivision(
        classLevel: ClassLevel,
        difficulty: Difficulty,
        random: Random
    ): GeneratedTuple {
        val (divisorRange, quotientRange) = when (classLevel) {
            ClassLevel.CLASS_1 -> when (difficulty) {
                Difficulty.EASY -> (2 to 3) to (1 to 4)
                Difficulty.MEDIUM -> (2 to 4) to (2 to 5)
                Difficulty.HARD -> (2 to 5) to (2 to 6)
            }
            ClassLevel.CLASS_2 -> when (difficulty) {
                Difficulty.EASY -> (2 to 5) to (2 to 5)
                Difficulty.MEDIUM -> (2 to 6) to (2 to 8)
                Difficulty.HARD -> (3 to 8) to (3 to 9)
            }
            ClassLevel.CLASS_3 -> when (difficulty) {
                Difficulty.EASY -> (2 to 6) to (2 to 8)
                Difficulty.MEDIUM -> (3 to 9) to (3 to 10)
                Difficulty.HARD -> (4 to 12) to (4 to 12)
            }
            ClassLevel.CLASS_4 -> when (difficulty) {
                Difficulty.EASY -> (3 to 9) to (5 to 12)
                Difficulty.MEDIUM -> (4 to 12) to (8 to 18)
                Difficulty.HARD -> (6 to 15) to (10 to 25)
            }
            ClassLevel.CLASS_5 -> when (difficulty) {
                Difficulty.EASY -> (4 to 12) to (10 to 24)
                Difficulty.MEDIUM -> (6 to 16) to (12 to 35)
                Difficulty.HARD -> (8 to 24) to (15 to 45)
            }
        }
        val b = random.nextInt(divisorRange.first, divisorRange.second + 1)
        val quotient = random.nextInt(quotientRange.first, quotientRange.second + 1)
        val a = b * quotient // Guarantees exact integer division with zero remainder
        return GeneratedTuple(
            a = a,
            b = b,
            answer = quotient,
            hint = "Think: $b times what number equals $a?"
        )
    }

    private fun buildFourUniqueOptions(
        correct: Int,
        operation: MathOperation,
        random: Random
    ): List<Int> {
        val options = linkedSetOf(correct)
        val step = if (correct >= 100) max(5, correct / 20) else 1
        val candidateOffsets = listOf(-4, -3, -2, -1, 1, 2, 3, 4, 5, 10, -10)

        var safety = 0
        while (options.size < 4 && safety < 60) {
            safety++
            val delta = candidateOffsets[random.nextInt(candidateOffsets.size)] * step
            val candidate = correct + delta
            if (candidate >= 0 && candidate != correct) {
                options.add(candidate)
            }
        }

        var fallback = 1
        while (options.size < 4) {
            val cand = correct + fallback
            if (!options.contains(cand)) {
                options.add(cand)
            }
            fallback++
        }

        return options.shuffled(random)
    }
}
