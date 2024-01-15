import { Chip, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { HackathonInformation } from '../models/HackathonInformation';
import { useState } from 'react';

export function Filter() {
    const [incentives, setIncentives] = useState<HackathonInformation['incentives'][]>([]);
    const [venue, setVenue] = useState<HackathonInformation['venue'][]>([]);
    const [size, setSize] = useState<HackathonInformation['size'][]>([]);
    const [types, setTypes] = useState<HackathonInformation['types']>([]);

    const renderChips = (selected: string[]) => {
        console.log(selected);
        return <div className="flex gap-1">
            {selected.map((value) =>
                <Chip key={value} label={value} />
            )}
        </div>;
    };

    return <form>
        <FormControl fullWidth>
            <InputLabel id="incentives">Incentives</InputLabel>
            <Select
                name="incentives"
                labelId="incentives"
                className="mb-5"
                variant="outlined"
                label="Incentives"
                value={incentives}
                multiple
                onChange={(e) => setIncentives(e.target.value as HackathonInformation['incentives'][])}
                renderValue={renderChips}>
                <MenuItem value="collaboration">Collaboration</MenuItem>
                <MenuItem value="competition">Competition</MenuItem>
            </Select>
        </FormControl>
        <FormControl fullWidth>
            <InputLabel id="venue">Venue</InputLabel>
            <Select
                name="venue"
                labelId="venue"
                className="mb-5"
                variant="outlined"
                label="Venue"
                value={venue}
                multiple
                onChange={(e) => setVenue(e.target.value as HackathonInformation['venue'][])}
                renderValue={renderChips}>
                <MenuItem value="in-person">In-person</MenuItem>
                <MenuItem value="virtual">Virtual</MenuItem>
                <MenuItem value="hybrid">Hybrid</MenuItem>
            </Select>
        </FormControl>
        <FormControl fullWidth>
            <InputLabel id="size">Size of your hackathon</InputLabel>
            <Select
                name="size"
                labelId="size"
                className="mb-5"
                variant="outlined"
                label="Size of your hackathon"
                value={size}
                multiple
                onChange={(e) => setSize(e.target.value as HackathonInformation['size'][])}
                renderValue={renderChips}>
                <MenuItem value="small">Small (up to 50 participants)</MenuItem>
                <MenuItem value="medium">Medium (up to 150 participants)</MenuItem>
                <MenuItem value="large">Large (more than 150 participants)</MenuItem>
            </Select>
        </FormControl>
        <FormControl fullWidth>
            <InputLabel id="types">Type</InputLabel>
            <Select
                name="types"
                labelId="types"
                className="mb-5"
                fullWidth
                required
                multiple
                variant="outlined"
                label="Types"
                value={types}
                onChange={(e) => setTypes(e.target.value as HackathonInformation['types'])}
                renderValue={renderChips}>
                <MenuItem value="prototype">Prototype focused</MenuItem>
                <MenuItem value="conceptual">Conceptual solution focused</MenuItem>
                <MenuItem value="analysis">Analysis focused</MenuItem>
                <MenuItem value="education">Education focused</MenuItem>
                <MenuItem value="community">Community focused</MenuItem>
                <MenuItem value="ideation">Ideation focused</MenuItem>
            </Select>
        </FormControl>
    </form>;
};