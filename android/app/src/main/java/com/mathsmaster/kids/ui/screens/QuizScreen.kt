package com.mathsmaster.kids.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.scaleIn
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.rounded.ArrowBack
import androidx.compose.material.icons.automirrored.rounded.VolumeOff
import androidx.compose.material.icons.automirrored.rounded.VolumeUp
import androidx.compose.material.icons.rounded.CheckCircle
import androidx.compose.material.icons.rounded.Close
import androidx.compose.material.icons.rounded.Star
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mathsmaster.kids.audio.SoundPlayer
import com.mathsmaster.kids.model.MathQuestion
import com.mathsmaster.kids.model.QuizConfig
import com.mathsmaster.kids.model.QuizSummary
import com.mathsmaster.kids.ui.components.AnimatedStarReward
import com.mathsmaster.kids.ui.theme.KidsBackground
import com.mathsmaster.kids.ui.theme.KidsBlue
import com.mathsmaster.kids.ui.theme.KidsCoral
import com.mathsmaster.kids.ui.theme.KidsEmerald
import com.mathsmaster.kids.ui.theme.KidsInk
import com.mathsmaster.kids.ui.theme.KidsMutedInk

@Composable
fun QuizScreen(
    config: QuizConfig,
    questions: List<MathQuestion>,
    soundEnabled: Boolean,
    onToggleSound: () -> Unit,
    onExit: () -> Unit,
    onQuizFinished: (QuizSummary) -> Unit
) {
    var currentIndex by remember(questions) { mutableIntStateOf(0) }
    var selectedOption by remember(questions) { mutableStateOf<Int?>(null) }
    var correctCount by remember(questions) { mutableIntStateOf(0) }
    var incorrectCount by remember(questions) { mutableIntStateOf(0) }

    val question = questions[currentIndex]
    val isAnswered = selectedOption != null
    val isCorrect = selectedOption == question.correctAnswer
    val titleText = if (config.isDailyPractice) {
        "Daily Practice"
    } else {
        config.operation?.title ?: "Maths Quiz"
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(KidsBackground)
            .padding(horizontal = 20.dp, vertical = 18.dp),
        verticalArrangement = Arrangement.spacedBy(18.dp)
    ) {
        // Top Quiz HUD
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            IconButton(onClick = onExit) {
                Icon(
                    imageVector = Icons.AutoMirrored.Rounded.ArrowBack,
                    contentDescription = "Back to Home",
                    tint = KidsInk
                )
            }

            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(
                    text = titleText,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = KidsInk
                )
                Text(
                    text = "${config.classLevel.label} · ${config.difficulty.label} · Q${currentIndex + 1}/${questions.size}",
                    fontSize = 12.sp,
                    color = KidsMutedInk
                )
            }

            Row(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Surface(
                    shape = RoundedCornerShape(12.dp),
                    color = Color.White,
                    modifier = Modifier.border(1.dp, Color(0xFFE2E8F0), RoundedCornerShape(12.dp))
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 8.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Rounded.Star,
                            contentDescription = "Stars earned",
                            tint = Color(0xFFF59E0B),
                            modifier = Modifier.size(18.dp)
                        )
                        Text(
                            text = "$correctCount",
                            fontSize = 15.sp,
                            fontWeight = FontWeight.ExtraBold,
                            color = KidsInk
                        )
                    }
                }

                Surface(
                    shape = RoundedCornerShape(12.dp),
                    color = if (soundEnabled) Color.White else Color(0xFFF1F5F9),
                    modifier = Modifier
                        .size(40.dp)
                        .border(1.dp, Color(0xFFE2E8F0), RoundedCornerShape(12.dp))
                ) {
                    IconButton(onClick = onToggleSound) {
                        Icon(
                            imageVector = if (soundEnabled) {
                                Icons.AutoMirrored.Rounded.VolumeUp
                            } else {
                                Icons.AutoMirrored.Rounded.VolumeOff
                            },
                            contentDescription = if (soundEnabled) {
                                "Mute sound effects"
                            } else {
                                "Unmute sound effects"
                            },
                            tint = if (soundEnabled) KidsEmerald else KidsMutedInk,
                            modifier = Modifier.size(20.dp)
                        )
                    }
                }
            }
        }

        LinearProgressIndicator(
            progress = { (currentIndex + if (isAnswered) 1 else 0).toFloat() / questions.size.toFloat() },
            modifier = Modifier
                .fillMaxWidth()
                .height(8.dp),
            color = KidsBlue,
            trackColor = Color(0xFFE2E8F0)
        )

        // Question Stage
        Surface(
            shape = RoundedCornerShape(22.dp),
            color = Color.White,
            modifier = Modifier
                .fillMaxWidth()
                .border(1.dp, Color(0xFFE2E8F0), RoundedCornerShape(22.dp))
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp, vertical = 30.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Text(
                    text = "Solve this problem",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = KidsMutedInk
                )
                Text(
                    text = question.equationText,
                    fontSize = 38.sp,
                    fontWeight = FontWeight.ExtraBold,
                    color = KidsInk,
                    textAlign = TextAlign.Center
                )
            }
        }

        // Four Multiple Choice Answers
        Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            question.options.chunked(2).forEach { rowOptions ->
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    rowOptions.forEach { optionValue ->
                        val isThisSelected = selectedOption == optionValue
                        val isThisCorrect = optionValue == question.correctAnswer

                        val containerColor = when {
                            !isAnswered -> Color.White
                            isThisCorrect -> Color(0xFFECFDF5)
                            isThisSelected -> Color(0xFFFEF2F2)
                            else -> Color(0xFFF8FAFC)
                        }
                        val borderColor = when {
                            !isAnswered -> Color(0xFFCBD5E1)
                            isThisCorrect -> KidsEmerald
                            isThisSelected -> KidsCoral
                            else -> Color(0xFFE2E8F0)
                        }
                        val textColor = when {
                            !isAnswered -> KidsInk
                            isThisCorrect -> KidsEmerald
                            isThisSelected -> KidsCoral
                            else -> KidsMutedInk
                        }

                        Button(
                            onClick = {
                                if (!isAnswered) {
                                    selectedOption = optionValue
                                    if (optionValue == question.correctAnswer) {
                                        correctCount += 1
                                        SoundPlayer.playCorrect()
                                    } else {
                                        incorrectCount += 1
                                        SoundPlayer.playIncorrect()
                                    }
                                }
                            },
                            shape = RoundedCornerShape(18.dp),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = containerColor,
                                contentColor = textColor
                            ),
                            contentPadding = PaddingValues(vertical = 20.dp),
                            modifier = Modifier
                                .weight(1f)
                                .height(74.dp)
                                .border(2.dp, borderColor, RoundedCornerShape(18.dp))
                        ) {
                            Text(
                                text = "$optionValue",
                                fontSize = 24.sp,
                                fontWeight = FontWeight.ExtraBold
                            )
                        }
                    }
                }
            }
        }

        // Instant Feedback + Star Animation
        AnimatedVisibility(
            visible = isAnswered,
            enter = fadeIn() + scaleIn(initialScale = 0.92f)
        ) {
            Surface(
                shape = RoundedCornerShape(18.dp),
                color = if (isCorrect) Color(0xFFECFDF5) else Color(0xFFFEF2F2),
                modifier = Modifier
                    .fillMaxWidth()
                    .border(
                        1.dp,
                        if (isCorrect) KidsEmerald else KidsCoral,
                        RoundedCornerShape(18.dp)
                    )
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    if (isCorrect) {
                        AnimatedStarReward(triggerKey = currentIndex)
                    } else {
                        Icon(
                            imageVector = Icons.Rounded.Close,
                            contentDescription = "Incorrect",
                            tint = KidsCoral,
                            modifier = Modifier.size(30.dp)
                        )
                    }

                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = if (isCorrect) {
                                "Great job! +1 Star"
                            } else {
                                "Nice try! Correct answer is ${question.correctAnswer}"
                            },
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (isCorrect) KidsEmerald else KidsCoral
                        )
                        Text(
                            text = question.hint,
                            fontSize = 13.sp,
                            color = KidsInk
                        )
                    }

                    if (isCorrect) {
                        Icon(
                            imageVector = Icons.Rounded.CheckCircle,
                            contentDescription = null,
                            tint = KidsEmerald,
                            modifier = Modifier.size(24.dp)
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.weight(1f))

        if (isAnswered) {
            Button(
                onClick = {
                    if (currentIndex + 1 < questions.size) {
                        currentIndex += 1
                        selectedOption = null
                    } else {
                        val percentage = (correctCount * 100) / questions.size
                        onQuizFinished(
                            QuizSummary(
                                config = config,
                                totalQuestions = questions.size,
                                correctAnswers = correctCount,
                                incorrectAnswers = incorrectCount,
                                starsEarned = correctCount, // 1 star per correct answer
                                percentage = percentage
                            )
                        )
                    }
                },
                shape = RoundedCornerShape(16.dp),
                colors = ButtonDefaults.buttonColors(containerColor = KidsBlue),
                contentPadding = PaddingValues(vertical = 16.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(
                    text = if (currentIndex + 1 < questions.size) "Next Question" else "See Final Score",
                    fontSize = 17.sp,
                    fontWeight = FontWeight.Bold
                )
            }
        }
    }
}
