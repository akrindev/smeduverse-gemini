import React, { useEffect, useState } from "react";
import { Dialog, DialogButton, List, ListInput } from "konsta/react";
import { api } from "@/hooks/auth";
import format from "date-fns/format";

// Components props
interface DialogDateProps {
  opened: boolean;
  onDateSelect: (date: any) => void;
}

export default function DialogDate({ opened, onDateSelect }: DialogDateProps) {
  const [selectedDate, setSelectedDate] = useState("");

  const handleDateChange = (date: any) => {
    setSelectedDate(date);
    onDateSelect(date);
  };
  return (
    <Dialog
      opened={opened}
      onBackdropClick={() => handleDateChange("")}
      title='Pilih Tanggal'
      buttons={
        <DialogButton onClick={() => handleDateChange(selectedDate)}>
          Confirm
        </DialogButton>
      }>
      <List nested className='-mx-4'>
        <ListInput
          outline
          label='Tanggal'
          type='date'
          placeholder='Please choose...'
          value={selectedDate}
          onChange={(e) => handleDateChange(e.target.value)}
        />
      </List>
    </Dialog>
  );
}
