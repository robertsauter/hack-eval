import { Card, CardActionArea, CardContent, IconButton, Typography } from "@mui/material";
import { HackathonInformation } from "../models/HackathonInformation";
import { useState } from "react";
import { Delete } from "@mui/icons-material";
import { hackathonService } from "../services/HackathonService";

export function HackathonCard(props: { hackathon: HackathonInformation, selectEvent: (id: string, selected: boolean) => void, deleteEvent: () => void }) {
    const { hackathon, selectEvent, deleteEvent } = props;

    const [selected, setSelected] = useState(false);

    const select = () => {
        const newValue = !selected;
        setSelected(newValue);
        selectEvent(hackathon.id || '', newValue);
    };

    const removeHackathon = async () => {
        if(hackathon.id) {
            const response = await hackathonService.removeHackathon(hackathon.id);

            if(response.ok) {
                deleteEvent();
            }
            else {
                //TODO: Handle delete failure
            }
        }
    };

    return <Card className="flex flex-col justify-between">
        <CardContent className="relative">
            <div className="absolute top-1 right-1">
                <IconButton onClick={removeHackathon}>
                    <Delete></Delete>
                </IconButton>
            </div>
            <Typography variant="h5">{ hackathon.title }</Typography>
            <div className="grid grid-cols-2">
                <Typography variant="body2" className="font-bold">Incentives:</Typography>
                <Typography variant="body2">{ hackathon.incentives }</Typography>
            </div>
            <div className="grid grid-cols-2">
                <Typography variant="body2" className="font-bold">Venue:</Typography>
                <Typography variant="body2">{ hackathon.venue }</Typography>
            </div>
            <div className="grid grid-cols-2">
                <Typography variant="body2" className="font-bold">Participants:</Typography>
                <Typography variant="body2">{ hackathon.participants }</Typography>
            </div>
            <div className="grid grid-cols-2">
                <Typography variant="body2" className="font-bold">Type:</Typography>
                <Typography variant="body2">{ hackathon.type }</Typography>
            </div>
        </CardContent>
        <CardActionArea onClick={select}>
            <div className={`flex justify-center items-center p-2 ${selected ? 'bg-green-500' : 'bg-blue-500'}`}>
                <Typography color="white">Select</Typography>
            </div>
        </CardActionArea>
    </Card>;
}