import { useState, useMemo, useEffect } from 'react'
import { Button } from '@/components/Button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/Dialog"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFoot,
  TableHead,
  TableHeaderCell,
  TableRoot,
  TableRow,
} from "@/components/Table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select"
import { Card } from '@/components/Card'
import { Checkbox } from '@/components/Checkbox'
import { Input } from '@/components/Input'
import { Label } from '@/components/Label'
import { CheckboxRemove } from '@/components/CheckboxRemove'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { showToast } from '@/app/[locale]/(protected)/dashboard/hooks/utils'

interface CSVColumnSelectorProps {
  isOpen: boolean
  onClose: () => void
  csvData: string[][]
  onSelectColumn: (columnIndices: number[], editedValues: string[]) => void
  isEditMode?: boolean
}

export default function CSVColumnSelector({
  isOpen,
  onClose,
  csvData,
  onSelectColumn,
  isEditMode = false,
}: CSVColumnSelectorProps) {
  const [selectedColumns, setSelectedColumns] = useState<Set<number>>(new Set())
  const [excludedRows, setExcludedRows] = useState<Set<number>>(new Set())
  const [separator, setSeparator] = useState(' ')
  const [editedValues, setEditedValues] = useState<Map<number, string>>(new Map())
  const [page, setPage] = useState(0)
  const [showEditMode, setShowEditMode] = useState(false)
  const rowsPerPage = 5

  // Auto-select first column when in edit mode
  useEffect(() => {
    if (isEditMode && isOpen && csvData.length > 0) {
      setSelectedColumns(new Set([0]))
    }
  }, [isEditMode, isOpen, csvData])

  const dataRows = useMemo(
    () => (csvData && csvData.length > 1 ? csvData.slice(1) : []),
    [csvData]
  )

  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage
    return dataRows.slice(start, start + rowsPerPage)
  }, [page, dataRows, rowsPerPage])

  if (!csvData || csvData.length === 0) return null

  const headers = csvData[0]
  const totalPages = Math.ceil(dataRows.length / rowsPerPage)

  const toggleColumnSelection = (index: number) => {
    const newSet = new Set(selectedColumns)
    if (newSet.has(index)) {
      newSet.delete(index)
    } else {
      newSet.add(index)
    }
    setSelectedColumns(newSet)
    // Clear edited values when column selection changes
    setEditedValues(new Map())
  }

  const toggleRowExclusion = (index: number) => {
    const newSet = new Set(excludedRows)
    if (newSet.has(index)) {
      newSet.delete(index)
    } else {
      newSet.add(index)
    }
    setExcludedRows(newSet)
  }

  const getMergedValue = (row: string[], rowIndex: number): string => {
    // Check if there's an edited value first
    if (editedValues.has(rowIndex)) {
      return editedValues.get(rowIndex) || ''
    }
    
    // Otherwise merge the selected columns
    const selectedIndices = Array.from(selectedColumns).sort((a, b) => a - b)
    return selectedIndices
      .map(idx => row[idx] || '')
      .filter(val => val.trim())
      .join(separator)
  }

  const updateEditedValue = (rowIndex: number, value: string) => {
    const newMap = new Map(editedValues)
    newMap.set(rowIndex, value)
    setEditedValues(newMap)
  }

  const filteredOptions = dataRows
    .map((row, idx) => ({
      index: idx,
      value: getMergedValue(row, idx)
    }))
    .filter(item => !excludedRows.has(item.index) && item.value.trim())

  const handleConfirm = () => {
    if (selectedColumns.size > 0) {
      const columnIndices = Array.from(selectedColumns).sort((a, b) => a - b)
      const finalValues = dataRows
        .map((row, idx) => {
          if (excludedRows.has(idx)) return null
          return getMergedValue(row, idx)
        })
        .filter((val): val is string => val !== null && val.trim() !== '')
      
      onSelectColumn(columnIndices, finalValues)
      onClose()
      // Reset state
      setSelectedColumns(new Set())
      setExcludedRows(new Set())
      setEditedValues(new Map())
      setSeparator(' ')
      setShowEditMode(false)
      showToast('success', 'Succès', "Select Mise à jour avec succès.");
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-6xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Modifier les options' : 'Sélectionner une ou plusieurs colonnes'}</DialogTitle>
          <DialogDescription className="mt-1 text-sm leading-6">
            {isEditMode
              ? "Modifiez ou supprimez les options existantes. Cochez 'Exclure' pour supprimer une option."
              : "Choisissez les colonnes à fusionner. Les nouvelles options seront ajoutées aux existantes (les doublons seront ignorés)."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto mt-4 space-y-4">
          {/* Separator Input */}
          {selectedColumns.size > 1 && (
            <Card className="p-4">
              <Label htmlFor="separator" className="text-sm font-medium">
                Séparateur entre colonnes
              </Label>
              <Input
                id="separator"
                value={separator}
                onChange={(e) => setSeparator(e.target.value)}
                placeholder="ex: - ou , ou ;"
                className="mt-2 max-w-xs"
              />
              <p className="text-xs text-gray-500 mt-1">
                Utilisé pour joindre les valeurs des colonnes sélectionnées
              </p>
            </Card>
          )}

          {/* Toggle Edit Mode */}
          {selectedColumns.size > 0 && (
            <div className="flex items-center gap-2">
              <Checkbox
                checked={showEditMode}
                onCheckedChange={(checked) => setShowEditMode(!!checked)}
              />
              <Label className="text-sm cursor-pointer" onClick={() => setShowEditMode(!showEditMode)}>
                Activer le mode édition des valeurs
              </Label>
            </div>
          )}

          {/* Table View */}
          {!showEditMode && (
            <TableRoot>
              <Table>
                <TableCaption>
                  Page {page + 1} sur {totalPages} — {dataRows.length} lignes au total
                </TableCaption>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell className="w-[50px]">Exclure</TableHeaderCell>
                    {headers.map((header, index) => (
                      <TableHeaderCell
                        key={index}
                        onClick={() => toggleColumnSelection(index)}
                        className={`cursor-pointer transition-colors ${
                          selectedColumns.has(index) ? 'bg-blue-100 dark:bg-blue-900' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={selectedColumns.has(index)}
                            onCheckedChange={() => toggleColumnSelection(index)}
                          />
                          <span className="truncate">
                            {header || `Colonne ${index + 1}`}
                          </span>
                        </div>
                      </TableHeaderCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {paginatedRows.map((row, rowIndex) => {
                    const actualIndex = page * rowsPerPage + rowIndex
                    return (
                      <TableRow
                        key={actualIndex}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <TableCell className="text-center">
                          <CheckboxRemove
                            checked={excludedRows.has(actualIndex)}
                            onCheckedChange={() => toggleRowExclusion(actualIndex)}
                          />
                        </TableCell>
                        {row.map((cell, cellIndex) => (
                          <TableCell
                            key={cellIndex}
                            className={`truncate max-w-xs ${
                              selectedColumns.has(cellIndex) ? 'bg-blue-50 dark:bg-blue-900/30' : ''
                            }`}
                            onClick={() => toggleColumnSelection(cellIndex)}
                          >
                            {cell || '-'}
                          </TableCell>
                        ))}
                      </TableRow>
                    )
                  })}
                </TableBody>

                <TableFoot>
                  <TableRow>
                    <TableCell colSpan={headers.length + 1} className="text-center">
                      <div className="flex items-center justify-center gap-3 mt-2">
                        <Button
                          variant="secondary"
                          disabled={page === 0}
                          onClick={() => setPage(page - 1)}
                        >
                        <ChevronLeft width={18}/>
                        </Button>
                        <span className="text-sm text-gray-500">
                          Page {page + 1} sur {totalPages}
                        </span>
                        <Button
                          variant="secondary"
                          disabled={page >= totalPages - 1}
                          onClick={() => setPage(page + 1)}
                        >
                        <ChevronRight width={18}/>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableFoot>
              </Table>
            </TableRoot>
          )}

          {/* Edit Mode View */}
          {showEditMode && selectedColumns.size > 0 && (
            <div className="space-y-3">
              <div className="text-sm font-medium mb-2">
                Modifier les valeurs fusionnées ({dataRows.length} lignes)
              </div>
              <div className="max-h-[400px] overflow-y-auto space-y-2">
                {dataRows.map((row, idx) => {
                  const isExcluded = excludedRows.has(idx)
                  const mergedValue = getMergedValue(row, idx)
                  
                  return (
                    <div key={idx} className="flex items-center gap-3">
                      <CheckboxRemove
                        checked={isExcluded}
                        onCheckedChange={() => toggleRowExclusion(idx)}
                      />
                      <span className="text-xs text-gray-500 w-12">#{idx + 1}</span>
                      <Input
                        value={editedValues.has(idx) ? editedValues.get(idx) : mergedValue}
                        onChange={(e) => updateEditedValue(idx, e.target.value)}
                        disabled={isExcluded}
                        className={`flex-1 ${isExcluded ? 'opacity-50' : ''}`}
                        placeholder="Valeur fusionnée"
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Preview */}
          {selectedColumns.size > 0 && (
            <Card className="p-4">
              <p className="text-sm font-medium mb-2">
                Aperçu des options finales ({filteredOptions.length} lignes incluses) :
              </p>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Aperçu des options" />
                </SelectTrigger>
                <SelectContent>
                  {filteredOptions.slice(0, 50).map((item, idx) => (
                    <SelectItem key={idx} value={String(idx)}>
                      {item.value || '(vide)'}
                    </SelectItem>
                  ))}
                  {filteredOptions.length > 50 && (
                    <SelectItem value="more" disabled>
                      ... et {filteredOptions.length - 50} autres options
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </Card>
          )}
        </div>

        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button className="mt-2 w-full sm:mt-0 sm:w-fit" variant="secondary">
              Annuler
            </Button>
          </DialogClose>
          <Button
            className="w-full sm:w-fit"
            onClick={handleConfirm}
            disabled={selectedColumns.size === 0}
          >
            Confirmer ({filteredOptions.length} options)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}