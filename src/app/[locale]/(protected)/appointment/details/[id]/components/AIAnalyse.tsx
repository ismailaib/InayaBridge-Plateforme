'use client'

import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { Input } from '@/components/Input'
import { Loader2, Send } from 'lucide-react'
import { FormEvent, useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { Badge } from '@/components/Badge'
import { Divider } from '@/components/Divider'

interface Message {
    from: 'user' | 'ai'
    text: string
}

interface UserData {
    firstName?: string
    lastName?: string
    profileImageUrl?: string
}

export const AIAnalyse = () => {
    const [question, setQuestion] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [chatHistory, setChatHistory] = useState<Message[]>([
        {
            from: 'ai',
            text: 'Bonjour Docteur. Posez-moi une question sur ce rendez-vous.'
        }
    ])
    const [userData, setUserData] = useState<UserData | null>(null)
    const [sessionId, setSessionId] = useState<string | null>(null) // <-- AJOUTÉ
    const chatEndRef = useRef<HTMLDivElement>(null)

    // ⚙️ CONFIGURATION - Mettez à jour cette valeur
    const N8N_WEBHOOK_URL = 'http://localhost:5678/webhook-test/5482ae33-9d20-4215-8eef-28dc987c867f'

    // Charger les informations utilisateur et gérer le Session ID
    useEffect(() => {
        // Charger les données utilisateur
        const userStr = localStorage.getItem('user')
        if (userStr) {
            try {
                const parsed = JSON.parse(userStr)
                setUserData(parsed)
            } catch (err) {
                console.error('Failed to parse user data from localStorage', err)
            }
        }

        // Gérer le Session ID pour la mémoire du Chat
        let currentSessionId = localStorage.getItem('inayaChatSessionId')
        if (!currentSessionId) {
            currentSessionId = crypto.randomUUID() // Crée un ID unique
            localStorage.setItem('inayaChatSessionId', currentSessionId)
        }
        setSessionId(currentSessionId)

    }, [])

    // Faire défiler vers le bas lorsque chatHistory est mis à jour
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [chatHistory, isLoading])

    const handleQuestionSubmit = async (e: FormEvent) => {
        e.preventDefault()
        // S'assurer que sessionId est chargé avant d'envoyer
        if (!question.trim() || isLoading || !sessionId) return

        const newHistory: Message[] = [...chatHistory, { from: 'user', text: question }]
        setChatHistory(newHistory)
        const currentQuestion = question
        setQuestion('')
        setIsLoading(true)

        try {
            // Appeler le webhook n8n
            const response = await fetch(N8N_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // CORPS MIS À JOUR : Envoyer le sessionId et le message
                body: JSON.stringify({
                    sessionId: sessionId,
                    message: currentQuestion,
                    context: {
                        type: 'medical_appointment',
                        language: 'fr'
                    }
                })
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            
            const aiResponse = data.output || 'Désolé, je n\'ai pas pu générer une réponse.'

            setChatHistory([...newHistory, { from: 'ai', text: aiResponse }])
        } catch (error) {
            console.error('Error calling n8n webhook:', error)
            setChatHistory([
                ...newHistory, 
                { 
                    from: 'ai', 
                    text: 'Désolé, une erreur s\'est produite. Veuillez réessayer.' 
                }
            ])
        } finally {
            setIsLoading(false)
        }
    }

    const getUserInitials = () => {
        const first = userData?.firstName?.[0] ?? ''
        const last = userData?.lastName?.[0] ?? ''
        return `${first}${last}`.toUpperCase()
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Colonne de Gauche (Résumés) */}
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <h3 className="flex flex-row items-center gap-2 font-semibold text-gray-900 dark:text-gray-100 mb-3">
                        <div className="w-1 h-5 rounded-full bg-blue-500"></div>
                        Résumé général
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Le patient présente des symptômes de [Symptôme A] et [Symptôme B], cohérents avec un diagnostic potentiel de [Maladie X].
                    </p>
                </Card>
                <Card>
                    <h3 className="flex flex-row items-center gap-2 font-semibold text-gray-900 dark:text-gray-100 mb-3">
                        <div className="w-1 h-5 rounded-full bg-purple-500"></div>
                        AI Thoughts
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Les résultats de laboratoire indiquent une légère anomalie dans [Marqueur Z]. Il serait prudent de surveiller ce marqueur lors de la prochaine visite.
                    </p>
                </Card>
                <Card>
                    <h3 className="flex flex-row items-center gap-2 font-semibold text-gray-900 dark:text-gray-100 mb-3">
                        <div className="w-1 h-5 rounded-full bg-green-500"></div>
                        AI Researches
                    </h3>
                    <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-2">
                        <li><a href="#" className="hover:underline">Étude sur la corrélation entre [Symptôme A] et [Maladie X] (Journal of Medicine, 2023)</a></li>
                        <li><a href="#" className="hover:underline">Nouvelles approches thérapeutiques pour [Maladie X]</a></li>
                    </ul>
                </Card>
            </div>

            {/* Colonne de Droite (Chat) */}
            <div className="lg:col-span-1">
                <Card className="flex flex-col h-full mb-4">
                    <div className="flex flex-row items-center justify-between">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">Inayabridge AI</h3>
                        <Badge variant="success">Connected</Badge>
                    </div>

                    <Divider />

                    <div className="flex-grow space-y-4 overflow-y-auto pr-2 h-96">
                        {chatHistory.map((msg, idx) => (
                            <div key={idx} className={`flex items-start gap-3 ${msg.from === 'user' ? 'justify-end' : ''}`}>
                                {msg.from === 'ai' && (
                                    <Image
                                        width={32}
                                        height={32}
                                        src="/images/AI-image.png"
                                        alt="AI"
                                        className="rounded-full border border-gray-400 dark:border-gray-900"
                                    />
                                )}
                                <div className={`rounded-lg px-3 py-2 max-w-xs ${msg.from === 'ai' ? 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200' : 'bg-blue-600 dark:bg-gray-950 text-white'}`}>
                                    <p className="text-sm">{msg.text}</p>
                                </div>
                                {msg.from === 'user' && (
                                    userData?.profileImageUrl ? (
                                        <Image
                                            width={32}
                                            height={32}
                                            src={userData.profileImageUrl}
                                            alt="User"
                                            className="rounded-full border border-gray-400 dark:border-gray-900 flex-shrink-0"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 dark:bg-gray-950 text-white font-semibold flex-shrink-0">
                                            {getUserInitials()}
                                        </div>
                                    )
                                )}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex items-start gap-3">
                                <Image
                                    width={32}
                                    height={32}
                                    src="/images/AI-image.png"
                                    alt="AI"
                                    className="rounded-full border border-gray-400 dark:border-gray-900"
                                />
                                <div className="rounded-lg px-3 py-2 bg-gray-100 dark:bg-gray-800">
                                    <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    <Divider />

                    <form onSubmit={handleQuestionSubmit} className="mt-4 flex items-center gap-2">
                        <Input
                            type="text"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="Posez une question..."
                            className="flex-grow"
                            disabled={isLoading}
                        />
                        <Button type="submit" variant="primary" disabled={isLoading || !question.trim()}>
                            <Send className="w-4 h-4" />
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    )
}