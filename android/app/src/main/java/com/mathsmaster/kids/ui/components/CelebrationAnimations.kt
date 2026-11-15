package com.mathsmaster.kids.ui.components

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.spring
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Star
import androidx.compose.material3.Icon
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.scale
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import kotlin.math.cos
import kotlin.math.sin

@Composable
fun AnimatedStarReward(
    triggerKey: Any,
    modifier: Modifier = Modifier
) {
    val scale = remember { Animatable(0.4f) }

    LaunchedEffect(triggerKey) {
        scale.snapTo(0.4f)
        scale.animateTo(
            targetValue = 1f,
            animationSpec = spring(
                dampingRatio = Spring.DampingRatioMediumBouncy,
                stiffness = Spring.StiffnessMedium
            )
        )
    }

    Box(
        modifier = modifier.scale(scale.value),
        contentAlignment = Alignment.Center
    ) {
        Icon(
            imageVector = Icons.Rounded.Star,
            contentDescription = "Earned star",
            tint = Color(0xFFF59E0B),
            modifier = Modifier.size(36.dp)
        )
    }
}

@Composable
fun AchievementBurstCanvas(
    modifier: Modifier = Modifier
) {
    val progress = remember { Animatable(0f) }

    LaunchedEffect(Unit) {
        progress.animateTo(
            targetValue = 1f,
            animationSpec = tween(durationMillis = 900)
        )
    }

    val colors = listOf(
        Color(0xFFF59E0B),
        Color(0xFF10B981),
        Color(0xFF2563EB),
        Color(0xFFEC4899),
        Color(0xFF8B5CF6)
    )

    Canvas(modifier = modifier.fillMaxSize()) {
        val center = Offset(size.width / 2f, size.height / 2f)
        val maxRadius = size.minDimension * 0.45f
        val count = 16
        for (i in 0 until count) {
            val angle = (i.toDouble() / count) * (2.0 * Math.PI)
            val dist = maxRadius * progress.value
            val x = center.x + (cos(angle) * dist).toFloat()
            val y = center.y + (sin(angle) * dist).toFloat()
            val alpha = (1f - progress.value).coerceIn(0f, 1f)
            drawCircle(
                color = colors[i % colors.size].copy(alpha = alpha),
                radius = 10f * (1f - progress.value * 0.4f),
                center = Offset(x, y)
            )
        }
    }
}
