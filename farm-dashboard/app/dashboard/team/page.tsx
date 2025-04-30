import { Suspense } from "react";
import TeamComponent from "./TeamComponent";

export default function Team() {
    return (
        <>
            <Suspense fallback={<p>loading</p>} >
                <TeamComponent />
            </Suspense>
        </>
    )
}