import { Button } from "@/components/ui/button";



const EventSaya = () => {
    return (
        <div className="w-full">
            <div className="flex justify-between max-w-2xl mx-auto border-b-2
            border-b-neutral-400">
               <p className="text-xl font-normal tracking-widest 
               border-b-4 border-b-blue-800 p-2">Event Akif</p>
               <p className="text-xl font-normal tracking-widest
               p-2">Event Draft</p>
               <p className="text-xl font-normal tracking-widest 
               p-2">Event Lalu</p>
            </div>

            <div className="container">
                
            </div>

            <div className="flex justify-center my-40">
                <Button className="bg-blue-700 hover:bg-blue-800">Buat Event tes</Button>
            </div>
        </div>
    )
}

export default EventSaya;