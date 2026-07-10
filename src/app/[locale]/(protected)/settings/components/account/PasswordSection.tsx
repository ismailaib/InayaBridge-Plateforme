import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Label } from "@/components/Label";
import { PasswordSectionProps } from "@/types/settings";

export const PasswordSection = ({ t, passwordData, errors, onPasswordChange, onInputBlur, onSubmit }: PasswordSectionProps) => (
    <form onSubmit={onSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            <div>
                <Label htmlFor="currentPassword">{t('passwordSection.currentLabel')}</Label>
                <Input
                    id="currentPassword"
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={onPasswordChange}
                    onBlur={onInputBlur}
                    placeholder="********"
                    className="mt-2"
                    required
                    minLength={8}
                    aria-invalid={!!errors.currentPassword}
                    aria-describedby={errors.currentPassword ? 'currentPassword-error' : undefined}
                />
                {errors.currentPassword && (
                    <p id="currentPassword-error" className="mt-1 text-xs text-red-600">
                        {errors.currentPassword}
                    </p>
                )}
            </div>

            <div>
                <Label htmlFor="newPassword">{t('passwordSection.newLabel')}</Label>
                <Input
                    id="newPassword"
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={onPasswordChange}
                    onBlur={onInputBlur}
                    placeholder="********"
                    className="mt-2"
                    required
                    minLength={8}
                    aria-invalid={!!errors.newPassword}
                    aria-describedby={errors.newPassword ? 'newPassword-error' : undefined}
                />
                {errors.newPassword && (
                    <p id="newPassword-error" className="mt-1 text-xs text-red-600">
                        {errors.newPassword}
                    </p>
                )}
            </div>
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
            <Button type="submit" disabled={!passwordData.currentPassword || !passwordData.newPassword}>
                {t('passwordSection.button')}
            </Button>
        </div>
    </form>
);
