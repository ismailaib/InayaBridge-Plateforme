import { Check, Copy } from "lucide-react";
import { useState } from "react";

type CopyableRowProps = {
    icon: React.ReactNode;
    label: string;
    value: string;
};

export const CopyableRow = ({ icon, label, value }: CopyableRowProps) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            console.error("Failed to copy:", err);
            return false;
        }
    };

    const handleCopy = async () => {
        const success = await copyToClipboard(value);
        if (success) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <tr className="border-b last:border-b-0 dark:border-gray-900">
            <td className="py-4 px-4 flex items-center gap-2">
                {icon}
                <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
            </td>
            <td className="py-2 px-4">
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-900 dark:text-gray-100 break-all pr-2">{value}</p>
                    <button
                        onClick={handleCopy}
                        className="flex-shrink-0 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        title="Copier"
                    >
                        {copied ? (
                            <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                        ) : (
                            <Copy className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                        )}
                    </button>
                </div>
            </td>
        </tr>
    );
};