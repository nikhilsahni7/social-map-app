/* eslint-disable @typescript-eslint/no-explicit-any */
// components/LocationInput.tsx
import { useMemo } from "react";
import { GoogleMap, LoadScript, Autocomplete } from "@react-google-maps/api";

interface LocationInputProps {
  address: string;
  onAddressSelect: (address: string, lat: number, lng: number) => void;
}

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;

export function LocationInput({
  address,
  onAddressSelect,
}: LocationInputProps) {
  const libraries = useMemo(() => ["places"], []);

  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    if (place.formatted_address && place.geometry?.location) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      onAddressSelect(place.formatted_address, lat, lng);
    }
  };

  return (
    <LoadScript
      googleMapsApiKey={GOOGLE_MAPS_API_KEY}
      libraries={libraries as any}
    >
      <div className="w-full">
        <Autocomplete
          onLoad={(autocomplete) => {
            autocomplete.addListener("place_changed", () => {
              const place = autocomplete.getPlace();
              handlePlaceSelect(place);
            });
          }}
        >
          <input
            type="text"
            placeholder="Enter location"
            defaultValue={address}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </Autocomplete>
      </div>
    </LoadScript>
  );
}
