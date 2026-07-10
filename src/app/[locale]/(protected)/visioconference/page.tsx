"use client";

import { useEffect, useState } from "react";
import { getAllAppointments, Appointment } from "@/api/appointments";
import { getPatientById, TenantPatient } from "@/api/patients";
import {
    Calendar,
    Clock,
    MonitorDot,
    Search,
    Filter,
    ScanEye,
    Airplay,
    CalendarPlus2,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { Divider } from "@/components/Divider";
import { Input } from "@/components/Input";

interface VisioItem {
    appointment: Appointment;
    patient: TenantPatient | null;
}

export default function VisioConferencePage() {
    const [calls, setCalls] = useState<VisioItem[]>([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<"ALL" | "TODAY" | "UPCOMING" | "COMPLETED">("ALL");

    const load = async () => {
        const res = await getAllAppointments();
        const video = res.data.filter((a) => a.consultationType === "VIDEO");

        const merged: VisioItem[] = await Promise.all(
            video.map(async (a) => {
                const p = await getPatientById(a.patientProfileId)
                    .then((r) => r.data)
                    .catch(() => null);
                return { appointment: a, patient: p };
            })
        );

        setCalls(merged);
        setLoading(false);
    };

    useEffect(() => {
        load();
    }, []);

    const calcAge = (dob?: string) => {
        if (!dob) return null;
        const d = new Date(dob);
        const diff = Date.now() - d.getTime();
        return Math.floor(diff / (1000 * 3600 * 24 * 365));
    };

    const getCountdown = (date: string, time: string) => {
        const sessionDate = new Date(`${date}T${time}`);
        const diff = sessionDate.getTime() - Date.now();

        if (diff <= 0) return "Commence maintenant";

        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);

        if (hours > 0) return `Dans ${hours}h ${minutes % 60}min`;
        return `Dans ${minutes} min`;
    };

    // -------- FILTERS --------
    const today = new Date().toISOString().split("T")[0];

    const filtered = calls.filter(({ appointment: a, patient: p }) => {
        const fullName = p ? `${p.firstName} ${p.lastName}` : a.patientFullName;

        const matchSearch =
            fullName.toLowerCase().includes(search.toLowerCase()) ||
            (p?.cin || "").includes(search);

        if (!matchSearch) return false;

        if (filter === "TODAY") return a.date === today;
        if (filter === "UPCOMING") return a.date > today;
        if (filter === "COMPLETED") return a.status === "COMPLETED";

        return true;
    });

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-semibold">Visioconférences</h3>
                    <p className="text-sm text-gray-500">Toutes les consultations vidéo programmées</p>
                </div>

                <Button>
                    <CalendarPlus2 width={18} className="mr-2" />
                    Programmer une nouvelle visioconférence
                </Button>
            </div>

            {/* SEARCH + FILTERS */}
            <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
                {/* Search */}
                <Input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Rechercher patient (nom, CIN)"
                    className="w-full bg-transparent outline-none text-sm"
                />

                {/* Filters */}
                <div className="flex gap-2">
                    {["ALL", "TODAY", "UPCOMING", "COMPLETED"].map((f) => (
                        <Button
                            key={f}
                            variant={filter === f ? "light" : "secondary"}
                            onClick={() => setFilter(f as any)}
                        >
                            {f === "ALL" && "Tous"}
                            {f === "TODAY" && "Aujourd'hui"}
                            {f === "UPCOMING" && "À venir"}
                            {f === "COMPLETED" && "Complétés"}
                        </Button>
                    ))}
                </div>
            </div>

            {loading && <div className="py-10 text-center text-gray-400">Chargement...</div>}
            {!loading && filtered.length === 0 && <div className="py-10 text-center text-gray-400">Aucun résultat</div>}

            {/* GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map(({ appointment: call, patient }) => (
                    <Card key={call.id}>
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex flex-row items-center gap-2">
                                <div className="p-2 rounded-lg bg-blue-100 dark:bg-gray-900">
                                    <MonitorDot width={28} />
                                </div>
                                <div>
                                    <div className="text-lg font-semibold">
                                        {patient ? `${patient.firstName} ${patient.lastName}` : call.patientFullName}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {getCountdown(call.date, call.startTime)}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mb-3">
                                <Badge variant="neutral" className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" /> {call.date}
                                </Badge>
                                <Badge variant="neutral" className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" /> {call.startTime}
                                </Badge>
                            </div>
                        </div>

                        <Divider className="my-4" />


                        {patient && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-loose">
                                Patient{" "}
                                <Badge variant="neutral">{patient.firstName} {patient.lastName}</Badge>,
                                CIN <Badge variant="neutral">{patient.cin}</Badge>
                                {patient.phone && (
                                    <> – Tel <Badge variant="neutral">{patient.phone}</Badge></>
                                )}
                                – Sexe <Badge variant="neutral">{patient.gender}</Badge>
                                {calcAge(patient.dateOfBirth) && (
                                    <> – <Badge variant="neutral">{calcAge(patient.dateOfBirth)} ans</Badge></>
                                )}
                            </p>
                        )}

                        {/* ACTION BUTTON */}
                        {call.status === "COMPLETED" ? (
                            <Link href={`/appointment/details/${call.id}`} className="block mt-4">
                                <Button variant="success" className="w-full">
                                    <ScanEye width={18} className="mr-2"/>
                                    Voir les détails du rendez-vous
                                </Button>
                            </Link>
                        ) : (
                            <Link href={`/visioconference/session/${call.id}`} className="block mt-4">
                                <Button className="w-full">
                                    <Airplay width={18} className="mr-2"/>
                                    Début Consultation
                                </Button>
                            </Link>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    );
}
