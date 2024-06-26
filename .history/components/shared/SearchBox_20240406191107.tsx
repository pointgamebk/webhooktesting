"use client";

import { ChangeEvent, useState } from "react";

import { useGoogleMapsScript, Libraries } from "use-google-maps-script";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ISearchBoxProps {
  defaultValue: string;
  onSelectAddress: (address: string) => void;
}

const libraries: Libraries = ["places"];

const SearchBox = ({ defaultValue, onSelectAddress }: ISearchBoxProps) => {
  const { isLoaded, loadError } = useGoogleMapsScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    libraries,
  });

  if (!isLoaded) return null;
  if (loadError) return <div>Error loading</div>;

  return (
    <ReadySearchBox
      defaultValue={defaultValue}
      onSelectAddress={onSelectAddress}
    />
  );
};

function ReadySearchBox({ defaultValue, onSelectAddress }: ISearchBoxProps) {
  const [open, setOpen] = useState(false);

  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete({ debounce: 300, defaultValue });

  const handleSelect = async (address: string) => {
    setValue(address, false);
    onSelectAddress(address);
    clearSuggestions();
    setOpen(false);

    // try {
    //   const results = await getGeocode({ address });
    //   const { lat, lng } = await getLatLng(results[0]);
    // } catch (error) {
    //   console.error("😱 Error: ", error);
    // }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <div className="w-full p-2 bg-white">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild className="bg-white">
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-white"
          >
            {value === "" ? "Search address..." : value}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[200px] p-0 bg-white"
          onChange={handleChange}
        >
          <Command className="bg-white">
            <CommandInput
              placeholder="Search address..."
              className="h-9 bg-white"
              disabled={!ready}
            />
            <CommandEmpty>No address found.</CommandEmpty>
            <CommandGroup className="bg-white">
              {data.map((suggestion) => (
                <CommandItem
                  key={suggestion.place_id}
                  value={suggestion.description}
                  onSelect={() => handleSelect(suggestion.description)}
                  className="bg-white"
                >
                  {suggestion.description}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === suggestion.description
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default SearchBox;
