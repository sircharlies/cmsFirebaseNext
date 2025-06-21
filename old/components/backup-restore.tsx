"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Upload, Database, AlertTriangle } from "lucide-react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

export function BackupRestore() {
  const [loading, setLoading] = useState(false)

  const exportData = async () => {
    setLoading(true)
    try {
      // Export pages
      const pagesSnapshot = await getDocs(collection(db, "pages"))
      const pages = []

      for (const pageDoc of pagesSnapshot.docs) {
        const pageData = { id: pageDoc.id, ...pageDoc.data() }

        // Get layouts for each page
        const layoutsSnapshot = await getDocs(collection(db, "pages", pageDoc.id, "layouts"))
        const layouts = layoutsSnapshot.docs.map((layoutDoc) => ({
          id: layoutDoc.id,
          ...layoutDoc.data(),
        }))

        pages.push({ ...pageData, layouts })
      }

      // Create and download JSON file
      const dataStr = JSON.stringify({ pages, exportDate: new Date().toISOString() }, null, 2)
      const dataBlob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(dataBlob)

      const link = document.createElement("a")
      link.href = url
      link.download = `cms-backup-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Export failed:", error)
      alert("Export failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        console.log("Import data:", data)
        alert("Import functionality would be implemented here. This is a preview of the backup data structure.")
      } catch (error) {
        alert("Invalid backup file format.")
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Backup & Restore
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-yellow-800">Important Notice</p>
              <p className="text-yellow-700">
                Always test imports on a development environment first. Importing data will overwrite existing content.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-medium">Export Data</h3>
              <p className="text-sm text-gray-600">
                Download a complete backup of your pages and layouts as a JSON file.
              </p>
              <Button onClick={exportData} disabled={loading} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                {loading ? "Exporting..." : "Export Backup"}
              </Button>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Import Data</h3>
              <p className="text-sm text-gray-600">Restore your content from a previously exported backup file.</p>
              <div className="relative">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button variant="outline" className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Backup
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
