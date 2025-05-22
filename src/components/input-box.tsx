import type { ReactNode } from '@tanstack/react-router';
import { CheckIcon } from 'lucide-react';
import { type HTMLInputTypeAttribute, useActionState, useId, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type InputBoxProps = {
  title?: string;
  label?: string;
  type?: HTMLInputTypeAttribute;
  children?: ReactNode;
  onInput?: (value: string) => string | Promise<string>;
};

export function InputBox(props: InputBoxProps) {
  const { title = 'Input', label, type, children, onInput = () => '' } = props;
  const [open, setOpen] = useState(false);
  const id = useId();
  const submit = async (_: string, formData: FormData) => {
    const value = formData.get('value');

    if (typeof value === 'string') {
      const err = await onInput(value);

      if (!err) {
        setOpen(false);
      }

      return err;
    }

    return 'Invalid value';
  };
  const [error, formAction] = useActionState(submit, '');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="flex flex-col gap-2" autoComplete="off">
          <div className="grid flex-1 gap-2">
            {label && <Label htmlFor={id}>{label}</Label>}
            <Input id={id} name="value" autoFocus type={type} />
            {error && <span className="text-destructive text-sm">{error}</span>}
          </div>
          <DialogFooter>
            <Button type="submit" size="sm" className="px-3">
              <CheckIcon />
              OK
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
