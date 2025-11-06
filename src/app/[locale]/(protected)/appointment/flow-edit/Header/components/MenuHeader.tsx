import { Button } from "@/components/Button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/DropdownMenu"
import { ChevronDown } from "lucide-react"

export default function MenuHeader() {
  return (
    <div className="flex flex-row items-center gap-2">
      <h1 className="text-lg font-semibold">Schéma de flux</h1>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="light" className="p-0 px-1">
            <ChevronDown width={18} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Concepteur de flux</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem shortcut="Ctrl+N">Crée Un Nouveau</DropdownMenuItem>
            <DropdownMenuItem shortcut="Ctrl+N">Mes schémas</DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem hint="Pro">Historique</DropdownMenuItem>
            <DropdownMenuItem shortcut="Ctrl+E">Exporter</DropdownMenuItem>
            <DropdownMenuItem shortcut="Ctrl+I">Importer</DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuItem>Tutoriels</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
