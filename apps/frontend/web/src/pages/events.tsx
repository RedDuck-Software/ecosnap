import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useGetCities } from '@/hooks/queries/use-get-cities';
import type { Event } from '@/hooks/queries/use-get-events';
import { useGetEvents } from '@/hooks/queries/use-get-events';
import { cn } from '@/lib/utils';

export default function Events() {
  const [parent] = useAutoAnimate();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [cityId, setCityId] = useState('');
  const [name, setName] = useState('');
  const { data: cities, isLoading: isCitiesLoading } = useGetCities();
  const { data: events, isLoading: isEventsLoading } = useGetEvents(cityId, name);

  const redirectToEvent = useCallback(
    (event: Event) => {
      navigate(`/events/${event.id}`);
    },
    [navigate],
  );

  return (
    <main className="container">
      <div className="flex flex-col gap-12">
        <div className="flex items-center gap-4">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
                {cityId ? cities?.find((c) => cityId === c.id)?.name : 'Select city...'}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              {isCitiesLoading ? (
                <div className="flex items-center justify-between p-4">
                  <Loader2 className="animate-spin h-8 w-8" />
                </div>
              ) : (
                <Command>
                  <CommandInput placeholder="Search city..." />
                  <CommandList>
                    <CommandEmpty>No cities found.</CommandEmpty>
                    <CommandGroup>
                      {cities?.map((c) => (
                        <CommandItem
                          key={c.id}
                          value={c.id}
                          onSelect={(current) => {
                            setCityId(current === cityId ? '' : current);
                            setOpen(false);
                          }}
                        >
                          <Check className={cn('mr-2 h-4 w-4', cityId === c.id ? 'opacity-100' : 'opacity-0')} />
                          {c.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              )}
            </PopoverContent>
          </Popover>
          <Input placeholder="Search name..." value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div ref={parent} className="flex flex-col gap-4">
          {isEventsLoading ? (
            <div className="flex items-center justify-between p-8">
              <Loader2 className="animate-spin h-8 w-8" />
            </div>
          ) : (
            events?.map((event) => (
              <div
                key={event.id}
                className="flex flex-col gap-4 p-4 border border-gray-200 rounded-lg shadow-md transition-all hover:scale-105 cursor-pointer"
                onClick={() => redirectToEvent(event)}
              >
                <div className="flex justify-between">
                  <h2 className="text-lg font-semibold">{event.name}</h2>
                  <div className="text-sm text-muted-foreground">{event.date}</div>
                </div>
                <p className="text-sm text-muted-foreground">{cities?.find((c) => c.id === event.cityId)?.name}</p>
                <p className="text-sm">{event.shortDescription}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
