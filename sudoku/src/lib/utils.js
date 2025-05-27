// Función para combinar nombres de clases de manera condicional
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
} 