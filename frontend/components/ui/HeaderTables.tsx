interface Props {
    title: string
    openModal: () => void
    textButton: string
}

export function HeaderTagles({ title, openModal, textButton }: Props) {

    return (
        <header className=" flex justify-between items-center px-10 py-4 mb-6 bg-[var(--color-conteiner)]">
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
            <button
                onClick={openModal}
                className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
            >
                {textButton}
            </button>
        </header>
    )
}