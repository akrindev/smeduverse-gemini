import React, { useEffect, useState } from 'react';
import { Dialog, DialogButton, List, ListItem, Radio } from 'konsta/react';
import { api } from '@/hooks/auth';

// Components props
interface DialogRombelProps {
    opened: boolean;
    onRombelSelect: (rombel: any) => void;
}

export default function DialogRombel({ opened, onRombelSelect }: DialogRombelProps) {
    const [rombels, setRombels] = useState([]);
    // selected rombels
    const [selected, setSelected] = useState('');

    useEffect(() => {
        api.get('/orbit/api/rombel/list')
            .then(response => setRombels(response.data));

        console.log('rendered');
    }, []);

    // on selected rombel
    const onSelectedRombel = (rombel: any) => {
        setSelected(rombel.id);
        onRombelSelect(rombel);
    };

    return (
        <Dialog
            opened={opened}
            onBackdropClick={() => onRombelSelect(null)}
            title="Pilih Rombel"
        >
            <List nested className="-mx-4">
                {rombels.map((rombel, index) => (
                    <ListItem
                        label
                        key={rombel.id}
                        title={rombel.nama}
                        onClick={() => onSelectedRombel(rombel)}
                        after={
                            <Radio
                                component="div"
                                value={rombel.id}
                                checked={selected === rombel.id}
                                onChange={() => onSelectedRombel(rombel)}
                            />
                        }
                    />
                ))}
            </List>
        </Dialog>
    );
}


