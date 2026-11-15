package com.mathsmaster.kids.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.rounded.VolumeOff
import androidx.compose.material.icons.automirrored.rounded.VolumeUp
import androidx.compose.material.icons.rounded.CalendarToday
import androidx.compose.material.icons.rounded.CheckCircle
import androidx.compose.material.icons.rounded.LocalFireDepartment
import androidx.compose.material.icons.rounded.Star
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mathsmaster.kids.model.ClassLevel
import com.mathsmaster.kids.model.Difficulty
import com.mathsmaster.kids.model.MathOperation
import com.mathsmaster.kids.model.UserProgress
import com.mathsmaster.kids.ui.theme.KidsAmber
import com.mathsmaster.kids.ui.theme.KidsBackground
import com.mathsmaster.kids.ui.theme.KidsBlue
import com.mathsmaster.kids.ui.theme.KidsEmerald
import com.mathsmaster.kids.ui.theme.KidsInk
import com.mathsmaster.kids.ui.theme.KidsMutedInk

@Composable
fun HomeScreen(
    progress: UserProgress,
    selectedClass: ClassLevel,
    selectedDifficulty: Difficulty,
    soundEnabled: Boolean,
    onToggleSound: () -> Unit,
    onSelectClass: (ClassLevel) -> Unit,
    onSelectDifficulty: (Difficulty) -> Unit,
    onStartOperationQuiz: (MathOperation) -> Unit,
    onStartDailyPractice: () -> Unit
) {
    val scrollState = rememberScrollState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(KidsBackground)
            .verticalScroll(scrollState)
            .padding(horizontal = 20.dp, vertical = 24.dp),
        verticalArrangement = Arrangement.spacedBy(20.dp)
    ) {
        // Header: App Title + Subtitle + Stars/Streak Counter
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = "Maths Master Kids",
                    style = MaterialTheme.typography.headlineMedium,
                    color = KidsInk
                )
                Text(
                    text = "Learn Maths with Fun!",
                    style = MaterialTheme.typography.bodyLarge,
                    color = KidsMutedInk
                )
            }

            Row(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Surface(
                    shape = RoundedCornerShape(14.dp),
                    color = Color.White,
                    modifier = Modifier.border(1.dp, Color(0xFFE2E8F0), RoundedCornerShape(14.dp))
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 12.dp, vertical = 10.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Rounded.Star,
                            contentDescription = "Total Stars",
                            tint = Color(0xFFF59E0B),
                            modifier = Modifier.size(22.dp)
                        )
                        Text(
                            text = "${progress.totalStars}",
                            fontSize = 18.sp,
                            fontWeight = FontWeight.ExtraBold,
                            color = KidsInk
                        )
                    }
                }

                Surface(
                    shape = RoundedCornerShape(14.dp),
                    color = if (soundEnabled) Color.White else Color(0xFFF1F5F9),
                    modifier = Modifier
                        .size(46.dp)
                        .border(1.dp, Color(0xFFE2E8F0), RoundedCornerShape(14.dp))
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
                            tint = if (soundEnabled) KidsEmerald else KidsMutedInk
                        )
                    }
                }
            }
        }

        // Class Selection (Class 1 to 5)
        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Text(
                text = "Select Your Class",
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
                color = KidsInk
            )
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                ClassLevel.entries.forEach { level ->
                    val selected = level == selectedClass
                    FilterChip(
                        selected = selected,
                        onClick = { onSelectClass(level) },
                        modifier = Modifier.weight(1f),
                        label = {
                            Text(
                                text = "Class ${level.number}",
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Bold,
                                maxLines = 1
                            )
                        },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = KidsBlue,
                            selectedLabelColor = Color.White,
                            containerColor = Color.White,
                            labelColor = KidsInk
                        )
                    )
                }
            }
        }

        // Difficulty Selection (Easy, Medium, Hard)
        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Text(
                text = "Choose Difficulty",
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
                color = KidsInk
            )
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Difficulty.entries.forEach { diff ->
                    val selected = diff == selectedDifficulty
                    FilterChip(
                        selected = selected,
                        onClick = { onSelectDifficulty(diff) },
                        modifier = Modifier.weight(1f),
                        label = {
                            Text(
                                text = diff.label,
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold
                            )
                        },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = KidsEmerald,
                            selectedLabelColor = Color.White,
                            containerColor = Color.White,
                            labelColor = KidsInk
                        )
                    )
                }
            }
        }

        // Four Large Colorful Operation Buttons
        Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            Text(
                text = "Pick a Maths Game (10 Questions)",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = KidsInk
            )

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                OperationBigButton(
                    operation = MathOperation.ADDITION,
                    onClick = { onStartOperationQuiz(MathOperation.ADDITION) },
                    modifier = Modifier.weight(1f)
                )
                OperationBigButton(
                    operation = MathOperation.SUBTRACTION,
                    onClick = { onStartOperationQuiz(MathOperation.SUBTRACTION) },
                    modifier = Modifier.weight(1f)
                )
            }

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                OperationBigButton(
                    operation = MathOperation.MULTIPLICATION,
                    onClick = { onStartOperationQuiz(MathOperation.MULTIPLICATION) },
                    modifier = Modifier.weight(1f)
                )
                OperationBigButton(
                    operation = MathOperation.DIVISION,
                    onClick = { onStartOperationQuiz(MathOperation.DIVISION) },
                    modifier = Modifier.weight(1f)
                )
            }
        }

        // Daily Practice Section
        Card(
            shape = RoundedCornerShape(18.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            modifier = Modifier
                .fillMaxWidth()
                .border(1.dp, Color(0xFFE2E8F0), RoundedCornerShape(18.dp))
        ) {
            Column(
                modifier = Modifier.padding(18.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Rounded.CalendarToday,
                            contentDescription = null,
                            tint = KidsBlue,
                            modifier = Modifier.size(20.dp)
                        )
                        Text(
                            text = "Daily Practice",
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold,
                            color = KidsInk
                        )
                    }

                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Rounded.LocalFireDepartment,
                            contentDescription = "Daily Streak",
                            tint = KidsAmber,
                            modifier = Modifier.size(20.dp)
                        )
                        Text(
                            text = "${progress.dailyStreak} day streak",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold,
                            color = KidsAmber
                        )
                    }
                }

                Text(
                    text = if (progress.dailyCompletedToday) {
                        "Awesome job! You finished today's mixed 10-question challenge. Play again anytime for extra stars!"
                    } else {
                        "Complete today's mixed 10-question challenge across Addition, Subtraction, Multiplication, and Division."
                    },
                    fontSize = 14.sp,
                    color = KidsMutedInk
                )

                Button(
                    onClick = onStartDailyPractice,
                    shape = RoundedCornerShape(14.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = if (progress.dailyCompletedToday) KidsEmerald else KidsBlue
                    ),
                    contentPadding = PaddingValues(vertical = 14.dp, horizontal = 20.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    if (progress.dailyCompletedToday) {
                        Icon(
                            imageVector = Icons.Rounded.CheckCircle,
                            contentDescription = null,
                            modifier = Modifier.size(18.dp)
                        )
                        Spacer(modifier = Modifier.size(8.dp))
                    }
                    Text(
                        text = if (progress.dailyCompletedToday) {
                            "Daily Practice Complete · Play Again"
                        } else {
                            "Start Daily Practice"
                        },
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }

        // Local Progress Summary Card
        Surface(
            shape = RoundedCornerShape(16.dp),
            color = Color.White,
            modifier = Modifier
                .fillMaxWidth()
                .border(1.dp, Color(0xFFE2E8F0), RoundedCornerShape(16.dp))
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                horizontalArrangement = Arrangement.SpaceEvenly
            ) {
                ProgressMetric("Quizzes", "${progress.totalQuizzesCompleted}")
                ProgressMetric("Correct", "${progress.totalCorrectAnswers}")
                val acc = if (progress.totalAttemptedQuestions > 0) {
                    (progress.totalCorrectAnswers * 100) / progress.totalAttemptedQuestions
                } else {
                    0
                }
                ProgressMetric("Accuracy", "$acc%")
            }
        }
    }
}

@Composable
private fun OperationBigButton(
    operation: MathOperation,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Button(
        onClick = onClick,
        shape = RoundedCornerShape(20.dp),
        colors = ButtonDefaults.buttonColors(
            containerColor = Color(operation.colorHex),
            contentColor = Color.White
        ),
        contentPadding = PaddingValues(16.dp),
        modifier = modifier.height(128.dp)
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Box(
                modifier = Modifier
                    .size(46.dp)
                    .background(Color.White.copy(alpha = 0.22f), RoundedCornerShape(14.dp)),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = operation.symbol,
                    fontSize = 28.sp,
                    fontWeight = FontWeight.ExtraBold,
                    color = Color.White
                )
            }
            Spacer(modifier = Modifier.height(10.dp))
            Text(
                text = operation.title,
                fontSize = 17.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White
            )
        }
    }
}

@Composable
private fun ProgressMetric(label: String, value: String) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(text = value, fontSize = 20.sp, fontWeight = FontWeight.ExtraBold, color = KidsInk)
        Text(text = label, fontSize = 12.sp, color = KidsMutedInk)
    }
}
