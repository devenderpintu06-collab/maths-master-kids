package com.mathsmaster.kids

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.mathsmaster.kids.audio.SoundPlayer
import com.mathsmaster.kids.data.ProgressRepository
import com.mathsmaster.kids.logic.QuestionGenerator
import com.mathsmaster.kids.model.MathOperation
import com.mathsmaster.kids.model.MathQuestion
import com.mathsmaster.kids.model.QuizConfig
import com.mathsmaster.kids.model.QuizSummary
import com.mathsmaster.kids.ui.screens.HomeScreen
import com.mathsmaster.kids.ui.screens.QuizScreen
import com.mathsmaster.kids.ui.screens.ResultScreen
import com.mathsmaster.kids.ui.theme.MathsMasterKidsTheme

sealed interface AppScreen {
    data object Home : AppScreen
    data class Quiz(val config: QuizConfig, val questions: List<MathQuestion>) : AppScreen
    data class Result(val summary: QuizSummary) : AppScreen
}

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val repository = ProgressRepository(applicationContext)

        setContent {
            MathsMasterKidsTheme {
                var progress by remember { mutableStateOf(repository.loadProgress()) }
                var selectedClass by remember { mutableStateOf(progress.selectedClass) }
                var selectedDifficulty by remember { mutableStateOf(progress.selectedDifficulty) }
                var soundEnabled by remember { mutableStateOf(progress.soundEnabled) }
                var currentScreen by remember { mutableStateOf<AppScreen>(AppScreen.Home) }

                LaunchedEffect(soundEnabled) {
                    SoundPlayer.enabled = soundEnabled
                }

                fun toggleSound() {
                    val next = !soundEnabled
                    soundEnabled = next
                    SoundPlayer.enabled = next
                    repository.saveSoundEnabled(next)
                    if (next) SoundPlayer.playClick()
                }

                fun launchQuiz(operation: MathOperation?, isDaily: Boolean) {
                    val config = QuizConfig(
                        classLevel = selectedClass,
                        difficulty = selectedDifficulty,
                        operation = operation,
                        isDailyPractice = isDaily
                    )
                    val questions = QuestionGenerator.generateQuiz(
                        classLevel = selectedClass,
                        difficulty = selectedDifficulty,
                        operation = operation,
                        questionCount = 10
                    )
                    currentScreen = AppScreen.Quiz(config = config, questions = questions)
                }

                when (val screen = currentScreen) {
                    is AppScreen.Home -> {
                        HomeScreen(
                            progress = progress,
                            selectedClass = selectedClass,
                            selectedDifficulty = selectedDifficulty,
                            soundEnabled = soundEnabled,
                            onToggleSound = { toggleSound() },
                            onSelectClass = { level ->
                                selectedClass = level
                                repository.saveSelection(level, selectedDifficulty)
                            },
                            onSelectDifficulty = { diff ->
                                selectedDifficulty = diff
                                repository.saveSelection(selectedClass, diff)
                            },
                            onStartOperationQuiz = { op ->
                                launchQuiz(operation = op, isDaily = false)
                            },
                            onStartDailyPractice = {
                                launchQuiz(operation = null, isDaily = true)
                            }
                        )
                    }

                    is AppScreen.Quiz -> {
                        QuizScreen(
                            config = screen.config,
                            questions = screen.questions,
                            soundEnabled = soundEnabled,
                            onToggleSound = { toggleSound() },
                            onExit = { currentScreen = AppScreen.Home },
                            onQuizFinished = { summary ->
                                progress = repository.recordQuizResult(summary)
                                currentScreen = AppScreen.Result(summary)
                            }
                        )
                    }

                    is AppScreen.Result -> {
                        ResultScreen(
                            summary = screen.summary,
                            onPracticeAgain = {
                                launchQuiz(
                                    operation = screen.summary.config.operation,
                                    isDaily = screen.summary.config.isDailyPractice
                                )
                            },
                            onBackToHome = { currentScreen = AppScreen.Home }
                        )
                    }
                }
            }
        }
    }
}
