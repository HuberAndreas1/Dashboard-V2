"use client"

import {useEffect, useState} from "react"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Calendar, Clock} from "lucide-react"

export default function DashboardHome() {
    // Set the open house date to November 21st, 2025
    const openHouseDate = new Date("2025-11-21T13:00:00").getTime()

    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    })

    const [isEventStarted, setIsEventStarted] = useState(false)
    const [currentTime] = useState(new Date())

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime()
            const difference = openHouseDate - now

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((difference % (1000 * 60)) / 1000),
                })
            } else {
                setIsEventStarted(true)
                clearInterval(timer)
            }
        }, 1000)

        return () => clearInterval(timer)
    }, [openHouseDate])

    const getGreeting = () => {
        const hour = currentTime.getHours()
        if (hour < 12) return "Good morning"
        if (hour < 18) return "Good afternoon"
        return "Good evening"
    }

    const formatNumber = (num: number) => {
        return num.toString().padStart(2, "0")
    }

    return (
        <div className="min-h-screen w-full bg-background mt-8">
            {/* Main Content */}
            <main className="flex-1 p-6">
                <div className="max-w-6xl mx-auto space-y-8">
                    {/* Welcome Section */}
                    <div className="space-y-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{getGreeting()}, John! 👋</h1>
                            <p className="text-lg text-muted-foreground">
                                Willkommen zurück im Dashboard!
                            </p>
                        </div>
                    </div>

                    {/* Countdown Section */}
                    <Card className="border-2 shadow-lg">
                        <CardHeader className="text-center pb-4">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <Calendar className="w-5 h-5 text-primary" />
                                <Badge variant="outline" className="text-primary border-primary/30">
                                    Tag der offenen Tür
                                </Badge>
                            </div>
                            <CardTitle className="text-2xl md:text-3xl font-bold text-foreground">
                                {!isEventStarted ? "Event startet in:" : "🎉 Event is Live!"}
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="pt-0">
                            {!isEventStarted ? (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    <div className="text-center p-4 bg-card rounded-lg border border-border shadow-sm">
                                        <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                                            {formatNumber(timeLeft.days)}
                                        </div>
                                        <div className="text-sm text-muted-foreground font-medium">
                                            {timeLeft.days === 1 ? "Day" : "Days"}
                                        </div>
                                    </div>

                                    <div className="text-center p-4 bg-card rounded-lg border border-border shadow-sm">
                                        <div className="text-2xl md:text-3xl font-bold text-blue-700 mb-1">
                                            {formatNumber(timeLeft.hours)}
                                        </div>
                                        <div className="text-sm text-muted-foreground font-medium">
                                            {timeLeft.hours === 1 ? "Hour" : "Hours"}
                                        </div>
                                    </div>

                                    <div className="text-center p-4 bg-card rounded-lg border border-border shadow-sm">
                                        <div className="text-2xl md:text-3xl font-bold text-accent mb-1">
                                            {formatNumber(timeLeft.minutes)}
                                        </div>
                                        <div className="text-sm text-muted-foreground font-medium">
                                            {timeLeft.minutes === 1 ? "Minute" : "Minutes"}
                                        </div>
                                    </div>

                                    <div className="text-center p-4 bg-card rounded-lg border border-border shadow-sm">
                                        <div className="text-2xl md:text-3xl font-bold text-destructive mb-1">
                                            {formatNumber(timeLeft.seconds)}
                                        </div>
                                        <div className="text-sm text-muted-foreground font-medium">
                                            {timeLeft.seconds === 1 ? "Second" : "Seconds"}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="text-4xl mb-4">🎉</div>
                                    <h3 className="text-xl font-semibold text-foreground mb-2">The Open House Event is Now Live!</h3>
                                    <p className="text-muted-foreground mb-4">
                                        Thank you for joining us. Explore the new features and connect with our team.
                                    </p>
                                </div>
                            )}

                            {/* Event Details */}
                            <div className="flex flex-wrap sm:flex-nowrap items-center w-full gap-4 pt-4 border-t border-border">
                                <div className="flex items-center flex-1/2 min-w-fit sm:justify-center gap-3 p-3 bg-muted/50 rounded-lg">
                                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                        <Calendar className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-foreground">Datum</p>
                                        <p className="text-sm text-muted-foreground">November 21, 2025</p>
                                    </div>
                                </div>

                                <div className="flex min-w-fit flex-1/2 items-center sm:justify-center gap-3 p-3 bg-muted/50 rounded-lg">
                                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                        <Clock className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-foreground">Zeit</p>
                                        <p className="text-sm text-muted-foreground">13:00 - 20:00</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}
