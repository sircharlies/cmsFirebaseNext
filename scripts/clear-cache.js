const { execSync } = require("child_process")

console.log("🧹 Limpando cache do Next.js...")

try {
  // Limpar cache do Next.js
  execSync("rm -rf .next", { stdio: "inherit" })
  console.log("✅ Cache do .next removido")

  // Limpar cache do node_modules (opcional)
  // execSync('rm -rf node_modules/.cache', { stdio: 'inherit' })
  // console.log('✅ Cache do node_modules removido')

  console.log("🎉 Cache limpo com sucesso!")
  console.log('💡 Execute "npm run dev" para reiniciar o servidor')
} catch (error) {
  console.error("❌ Erro ao limpar cache:", error.message)
  process.exit(1)
}
