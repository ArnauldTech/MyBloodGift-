type FormLay = {
  title: string
  children: React.ReactNode
}
function FormLayout({ title, children }: FormLay) {
  return (
    <main className="max-w-screen bg-white flex">
      <form action="" className="max-w-4xl bg-primary/50 rounded-lg p-5">
        <h3 className="text-xl text-center font-bold">{title}</h3>

        <div className="flex gap-3 px-4 backdrop-blur-2xl"></div>
        {children && <input type="email" name="" id="" />}
      </form>
    </main>
  )
}
export default FormLayout
