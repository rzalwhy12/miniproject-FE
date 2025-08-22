import React, { Suspense } from "react";
import TicketsPageClient from "./TicketsPageClient";

const TicketsPage = () => {
    return (
        <Suspense fallback={<div className="p-6 text-center">Loading tickets...</div>}>
            <TicketsPageClient />
        </Suspense>
    );
};

export default TicketsPage;