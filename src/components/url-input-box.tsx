import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import type { ReactNode } from '@tanstack/react-router';
import { CheckIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod/v4-mini';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  value: z.url({ protocol: /^https?$/ }),
});

type FormSchema = z.infer<typeof formSchema>;

type UrlInputBoxProps = {
  title?: string;
  label?: string;
  children?: ReactNode;
  onInput?: (value: string) => void | Promise<void>;
};

export function UrlInputBox(props: UrlInputBoxProps) {
  const { title = 'Input URL', label, children, onInput = () => '' } = props;
  const [open, setOpen] = useState(false);
  const form = useForm<FormSchema>({
    resolver: standardSchemaResolver(formSchema),
    defaultValues: {
      value: '',
    },
  });

  const submit = async (values: FormSchema) => {
    try {
      await onInput(values.value);
      setOpen(false);
    } catch (e) {
      const err = e as Error;
      toast.error(err.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="flex flex-col gap-2"
            autoComplete="off"
            onSubmit={form.handleSubmit(submit)}
          >
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  {label && <FormLabel>{label}</FormLabel>}
                  <FormControl>
                    <Input {...field} type="url" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" size="sm" disabled={form.formState.isSubmitting}>
                <CheckIcon />
                OK
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
