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
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.EmojiEvents
import androidx.compose.material.icons.rounded.Home
import androidx.compose.material.icons.rounded.Refresh
import androidx.compose.material.icons.rounded.Star
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mathsmaster.kids.model.QuizSummary
import com.mathsmaster.kids.ui.components.AchievementBurstCanvas
import com.mathsmaster.kids.ui.theme.KidsAmber
import com.mathsmaster.kids.ui.theme.KidsBackground
import com.mathsmaster.kids.ui.theme.KidsBlue
import com.mathsmaster.kids.ui.theme.KidsCoral
import com.mathsmaster.kids.ui.theme.KidsEmerald
import com.mathsmaster.kids.ui.theme.KidsInk
import com.mathsmaster.kids.ui.theme.KidsMutedInk

@Composable
fun ResultScreen(
    summary: QuizSummary,
    onPracticeAgain: () -> Unit,
    onBackToHome: () -> Unit
) {
    val praiseTitle = when {
        summary.percentage >= 90 -> "Maths Superstar!"
        summary.percentage >= 70 -> "Great Achievement!"
        summary.percentage >= 50 -> "Good Effort!"
        else -> "Keep Practicing!"
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(KidsBackground)
            .padding(horizontal = 20.dp, vertical = 28.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Box(
            modifier = Modifier.size(160.dp),
            contentAlignment = Alignment.Center
        ) {
            if (summary.percentage >= 60) {
                AchievementBurstCanvas()
            }
            Icon(
                imageVector = Icons.Rounded.EmojiEvents,
                contentDescription = "Achievement Trophy",
                tint = Color(0xFFF59E0B),
                modifier = Modifier.size(84.dp)
            )
        }

        Spacer(modifier = Modifier.height(12.dp))

        Text(
            text = praiseTitle,
            fontSize = 28.sp,
            fontWeight = FontWeight.ExtraBold,
            color = KidsInk
        )

        Text(
            text = "${summary.config.classLevel.label} · ${summary.config.difficulty.label}",
            fontSize = 14.sp,
            color = KidsMutedInk
        )

        Spacer(modifier = Modifier.height(24.dp))

        Surface(
            shape = RoundedCornerShape(20.dp),
            color = Color.White,
            modifier = Modifier
                .fillMaxWidth()
                .border(1.dp, Color(0xFFE2E8F0), RoundedCornerShape(20.dp))
        ) {
            Column(
                modifier = Modifier.padding(20.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceEvenly
                ) {
                    StatCell(
                        label = "Final Score",
                        value = "${summary.correctAnswers}/${summary.totalQuestions}",
                        valueColor = KidsBlue
                    )
                    StatCell(
                        label = "Percentage",
                        value = "${summary.percentage}%",
                        valueColor = KidsInk
                    )
                }

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceEvenly
                ) {
                    StatCell(
                        label = "Correct",
                        value = "${summary.correctAnswers}",
                        valueColor = KidsEmerald
                    )
                    StatCell(
                        label = "Incorrect",
                        value = "${summary.incorrectAnswers}",
                        valueColor = KidsCoral
                    )
                }

                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Color(0xFFFFFBEB), RoundedCornerShape(12.dp))
                        .padding(12.dp),
                    horizontalArrangement = Arrangement.Center,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = Icons.Rounded.Star,
                        contentDescription = null,
                        tint = KidsAmber,
                        modifier = Modifier.size(22.dp)
                    )
                    Spacer(modifier = Modifier.size(8.dp))
                    Text(
                        text = "+${summary.starsEarned} Stars Earned!",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        color = KidsAmber
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(28.dp))

        Button(
            onClick = onPracticeAgain,
            shape = RoundedCornerShape(16.dp),
            colors = ButtonDefaults.buttonColors(containerColor = KidsBlue),
            contentPadding = PaddingValues(vertical = 16.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Icon(imageVector = Icons.Rounded.Refresh, contentDescription = null)
            Spacer(modifier = Modifier.size(8.dp))
            Text(text = "Practice Again", fontSize = 17.sp, fontWeight = FontWeight.Bold)
        }

        Spacer(modifier = Modifier.height(12.dp))

        OutlinedButton(
            onClick = onBackToHome,
            shape = RoundedCornerShape(16.dp),
            contentPadding = PaddingValues(vertical = 16.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Icon(imageVector = Icons.Rounded.Home, contentDescription = null)
            Spacer(modifier = Modifier.size(8.dp))
            Text(text = "Back to Home", fontSize = 16.sp, fontWeight = FontWeight.Bold)
        }
    }
}

@Composable
private fun StatCell(label: String, value: String, valueColor: Color) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(text = value, fontSize = 26.sp, fontWeight = FontWeight.ExtraBold, color = valueColor)
        Text(text = label, fontSize = 13.sp, color = KidsMutedInk)
    }
}
