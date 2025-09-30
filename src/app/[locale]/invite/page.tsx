"use client";

import { acceptInvitations, getInvitation } from "@/api/invitations";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Input } from "@/components/Input";
import { Label } from "@/components/Label";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import logo from "../../icon-logo.png";
import { MailCheck, AlertCircle, CheckCircle2, Clock, UserCheck, Loader2, Shield, Users } from "lucide-react";
import { getTenant } from "@/api/tenant";
import { toast } from "@/lib/useToast";

// Types
interface Invitation {
  id: string;
  email: string;
  status: "PENDING" | "ACCEPTED" | "EXPIRED" | "DECLINED";
  expiresAt: string;
  tenantId: string;
}

interface Tenant {
  id: string;
  name: string;
  logo?: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

export default function InvitePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  // State management
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: ""
  });

  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});

  // Fetch invitation data
  useEffect(() => {
    if (!token) {
      setError("Aucun jeton d'invitation fourni.");
      setLoading(false);
      return;
    }

    async function fetchInvitation() {
      try {
        const invitationRes = await getInvitation(token ?? "");
        const invitationData = invitationRes.data;
        
        setInvitation(invitationData);

        // Handle different invitation statuses
        if (invitationData.status === "ACCEPTED") {
          toast({
            title: "Invitation déjà acceptée",
            description: "Cette invitation a déjà été acceptée. Redirection vers la connexion...",
            variant: "error",
            duration: 3000,
          });
          setTimeout(() => router.push("/login"), 2000);
          return;
        }

        if (invitationData.status === "EXPIRED") {
          setError("Cette invitation a expiré. Veuillez contacter votre administrateur.");
          return;
        }

        if (invitationData.status === "DECLINED") {
          setError("Cette invitation a été refusée.");
          return;
        }

        // Fetch tenant information
        const tenantRes = await getTenant(invitationData.tenantId);
        setTenant(tenantRes.data);
      } catch (err) {
        console.error("Erreur lors de la récupération de l'invitation:", err);
        setError("Invitation introuvable ou expirée. Veuillez vérifier le lien.");
      } finally {
        setLoading(false);
      }
    }

    fetchInvitation();
  }, [token, router]);

  // Form validation
  const validateForm = (): boolean => {
    const errors: Partial<FormData> = {};

    if (!formData.firstName.trim()) {
      errors.firstName = "Le prénom est requis";
    }

    if (!formData.lastName.trim()) {
      errors.lastName = "Le nom est requis";
    }

    if (!formData.password) {
      errors.password = "Le mot de passe est requis";
    } else if (formData.password.length < 8) {
      errors.password = "Le mot de passe doit contenir au moins 8 caractères";
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await acceptInvitations(
        {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          password: formData.password,
        },
        token ?? ""
      );
      
      setSuccess(true);
      toast({
        title: "Compte créé avec succès !",
        description: "Votre invitation a été acceptée. Redirection vers la connexion...",
        variant: "success",
        duration: 3000,
      });

      // Redirect after success
      setTimeout(() => router.push("/login"), 3000);
    } catch (err: any) {
      console.error("Erreur lors de l'acceptation de l'invitation:", err);
      setError(
        err?.response?.data?.message || 
        "Impossible d'accepter l'invitation. Veuillez réessayer."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));

    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Chargement de l&apos;invitation...
          </h2>
          <p className="text-sm text-gray-500">Veuillez patienter</p>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Invitation non valide
          </h2>
          <p className="text-sm text-red-600 dark:text-red-400 mb-6 max-w-md">
            {error}
          </p>
          <Button 
            onClick={() => router.push("/login")}
            variant="secondary"
          >
            Retour à la connexion
          </Button>
        </motion.div>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Bienvenue dans InayaBridge !
          </h2>
          <p className="text-sm text-green-600 dark:text-green-400 mb-4">
            Votre compte a été créé avec succès
          </p>
          <p className="text-xs text-gray-500">
            Redirection automatique vers la connexion...
          </p>
        </motion.div>
      </div>
    );
  }

  // Main invitation form
  return (
    <div className="flex min-h-screen flex-col justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 px-4 py-12">
      <div className="mx-auto w-full max-w-md">
        {/* Logo and Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-6">
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="relative w-fit rounded-xl bg-white p-4 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/20 dark:bg-gray-900 dark:shadow-emerald-400/5 dark:ring-emerald-400/20"
              >
                {/* Decorative dots */}
                <div className="absolute left-[9%] top-[9%] size-1 rounded-full bg-emerald-200 dark:bg-emerald-800" />
                <div className="absolute right-[9%] top-[9%] size-1 rounded-full bg-emerald-200 dark:bg-emerald-800" />
                <div className="absolute bottom-[9%] left-[9%] size-1 rounded-full bg-emerald-200 dark:bg-emerald-800" />
                <div className="absolute bottom-[9%] right-[9%] size-1 rounded-full bg-emerald-200 dark:bg-emerald-800" />
                
                <div className="rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 p-3 shadow-md">
                  <Image src={logo} alt="InayaBridge Logo" width={28} height={28} />
                </div>
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Vous êtes invité à rejoindre
            </h1>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xl font-semibold text-emerald-600 dark:text-emerald-400">
                {tenant?.name}
              </span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>
                Expire le : {invitation ? new Date(invitation.expiresAt).toLocaleString('fr-FR') : ''}
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Invitation Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl ring-1 ring-gray-200/50 dark:bg-gray-900/80 dark:ring-gray-800/50">
            <div className="p-8">
              <div className="flex items-center gap-2 mb-6">
                <UserCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Créer votre compte
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Fields */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="firstName" className="font-medium text-gray-700 dark:text-gray-300">
                      Prénom *
                    </Label>
                    <Input
                      type="text"
                      id="firstName"
                      name="firstName"
                      autoComplete="given-name"
                      placeholder="Votre prénom"
                      value={formData.firstName}
                      onChange={handleInputChange('firstName')}
                      className={`mt-2 ${formErrors.firstName ? 'border-red-500 focus:border-red-500' : ''}`}
                      required
                    />
                    <AnimatePresence>
                      {formErrors.firstName && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-xs text-red-600 mt-1"
                        >
                          {formErrors.firstName}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <div>
                    <Label htmlFor="lastName" className="font-medium text-gray-700 dark:text-gray-300">
                      Nom *
                    </Label>
                    <Input
                      type="text"
                      id="lastName"
                      name="lastName"
                      autoComplete="family-name"
                      placeholder="Votre nom"
                      value={formData.lastName}
                      onChange={handleInputChange('lastName')}
                      className={`mt-2 ${formErrors.lastName ? 'border-red-500 focus:border-red-500' : ''}`}
                      required
                    />
                    <AnimatePresence>
                      {formErrors.lastName && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-xs text-red-600 mt-1"
                        >
                          {formErrors.lastName}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Password Fields */}
                <div>
                  <Label htmlFor="password" className="font-medium text-gray-700 dark:text-gray-300">
                    Mot de passe *
                  </Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      type="password"
                      id="password"
                      name="password"
                      autoComplete="new-password"
                      placeholder="Minimum 8 caractères"
                      value={formData.password}
                      onChange={handleInputChange('password')}
                      className={`mt-2 pl-10 ${formErrors.password ? 'border-red-500 focus:border-red-500' : ''}`}
                      required
                    />
                  </div>
                  <AnimatePresence>
                    {formErrors.password && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-xs text-red-600 mt-1"
                      >
                        {formErrors.password}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div>
                  <Label htmlFor="confirmPassword" className="font-medium text-gray-700 dark:text-gray-300">
                    Confirmer le mot de passe *
                  </Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      autoComplete="new-password"
                      placeholder="Confirmez votre mot de passe"
                      value={formData.confirmPassword}
                      onChange={handleInputChange('confirmPassword')}
                      className={`mt-2 pl-10 ${formErrors.confirmPassword ? 'border-red-500 focus:border-red-500' : ''}`}
                      required
                    />
                  </div>
                  <AnimatePresence>
                    {formErrors.confirmPassword && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-xs text-red-600 mt-1"
                      >
                        {formErrors.confirmPassword}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg hover:shadow-xl transition-all duration-200" 
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Création en cours...
                    </>
                  ) : (
                    <>
                      <MailCheck className="h-4 w-4 mr-2" />
                      Accepter l&apos;invitation et créer mon compte
                    </>
                  )}
                </Button>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 dark:bg-red-950/50 dark:border-red-800 dark:text-red-400"
                    >
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-center text-xs text-gray-500 mt-8"
        >
          En créant votre compte, vous acceptez nos conditions d&apos;utilisation
        </motion.p>
      </div>
    </div>
  );
}