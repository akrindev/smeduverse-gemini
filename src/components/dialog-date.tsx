import React, { useEffect, useState } from 'react';
import { Dialog, DialogButton, List, ListInput } from 'konsta/react';
import { api } from '@/hooks/auth';

// Components props
interface DialogDateProps {
    opened: boolean;
    onDateSelect: (date: any) => void;
}

export default function DialogDate({ opened, onDateSelect }: DialogDateProps) {
    const [selectedDate, setSelectedDate] = useState(false);

    const handleDateChange = (date: any) => {
        setSelectedDate(date);
        onDateSelect(date);
    };

    return (
        <Dialog
            opened={opened}
            onBackdropClick={() => handleDateChange(null)}
            title="Pilih Tanggal"
            buttons={
                <DialogButton onClick={() => onDateSelect(selectedDate)}>
                    Confirm
                </DialogButton>
            }
        >
            <List nested className="-mx-4">
                <ListInput
                    outline
                    label="Tanggal"
                    type="date"
                    defaultValue="2023-08-17"
                    placeholder="Please choose..."
                />
            </List>
        </Dialog>
    );
}
