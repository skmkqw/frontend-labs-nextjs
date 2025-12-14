import Button from "./components/button";

export default function NotFound() {
    return (
        <div className="h-screen m-auto flex justify-center items-center">
            <div className="max-w-xs overflow-hidden rounded-lg shadow-lg bg-gray-700">
                <div className="px-6 py-4">
                    <h4 className="mb-3 text-2xl font-semibold text-white">
                        Nie znaleziono strony
                    </h4>
                    <p className="leading-normal text-white">
                        Wygląda na to, że adres jest nieprawidłowy Wróć do
                        strony głównej, aby kontynuować.
                    </p>

                    <Button
                        variant="link"
                        href="/"
                        className="w-full mt-4 text-lg py-6"
                    >
                        Wróć
                    </Button>
                </div>
            </div>
        </div>
    );
}