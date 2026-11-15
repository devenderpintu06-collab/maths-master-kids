package com.mathsmaster.kids.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Typography
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

val KidsBackground = Color(0xFFFAF9F6)
val KidsSurface = Color(0xFFFFFFFF)
val KidsInk = Color(0xFF0F172A)
val KidsMutedInk = Color(0xFF475569)
val KidsBlue = Color(0xFF2563EB)
val KidsEmerald = Color(0xFF059669)
val KidsAmber = Color(0xFFD97706)
val KidsPurple = Color(0xFF7C3AED)
val KidsCoral = Color(0xFFDC2626)

private val KidsColorScheme = lightColorScheme(
    primary = KidsBlue,
    onPrimary = Color.White,
    secondary = KidsEmerald,
    onSecondary = Color.White,
    tertiary = KidsAmber,
    onTertiary = Color.White,
    background = KidsBackground,
    onBackground = KidsInk,
    surface = KidsSurface,
    onSurface = KidsInk,
    surfaceVariant = Color(0xFFF1F5F9),
    onSurfaceVariant = KidsMutedInk
)

private val KidsTypography = Typography(
    displayLarge = TextStyle(
        fontSize = 36.sp,
        fontWeight = FontWeight.ExtraBold,
        lineHeight = 42.sp
    ),
    headlineMedium = TextStyle(
        fontSize = 26.sp,
        fontWeight = FontWeight.Bold,
        lineHeight = 32.sp
    ),
    titleLarge = TextStyle(
        fontSize = 20.sp,
        fontWeight = FontWeight.Bold,
        lineHeight = 26.sp
    ),
    bodyLarge = TextStyle(
        fontSize = 16.sp,
        fontWeight = FontWeight.Medium,
        lineHeight = 24.sp
    ),
    labelLarge = TextStyle(
        fontSize = 15.sp,
        fontWeight = FontWeight.Bold
    )
)

@Composable
fun MathsMasterKidsTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = KidsColorScheme,
        typography = KidsTypography,
        content = content
    )
}
