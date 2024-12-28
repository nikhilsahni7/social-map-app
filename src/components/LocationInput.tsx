// components/LocationInput.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useLoadScript } from "@react-google-maps/api";
import { Loader2 } from "lucide-react";

interface LocationInputProps {
  defaultValue?: string;
  onLocationSelect: (location: { coordinates: number[]; address: string }) => void;
}

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;

export function LocationInput({ defaultValue, onLocationSelect }: LocationInputProps) {
  const [inputValue, setInputValue] = useState(defaultValue);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const initAutocomplete = useCallback(
    (input: HTMLInputElement) => {
      if (!input) return;

      const autocomplete = new google.maps.places.Autocomplete(input);
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.formatted_address && place.geometry?.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          setInputValue(place.formatted_address);
          onLocationSelect({ coordinates: [lat, lng], address: place.formatted_address });
        }
      });
    },
    [onLocationSelect]
  );

  const getCurrentLocation = useCallback(() => {
    setIsLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const geocoder = new google.maps.Geocoder();
            const response = await geocoder.geocode({
              location: { lat: latitude, lng: longitude },
            });

            if (response.results[0]) {
              const address = response.results[0].formatted_address;
              setInputValue(address);
              onLocationSelect({ coordinates: [latitude, longitude], address });
            }
          } catch (error) {
            console.error("Error getting address:", error);
          } finally {
            setIsLoadingLocation(false);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLoadingLocation(false);
        }
      );
    }
  }, [onLocationSelect]);

  useEffect(() => {
    if (isLoaded && !defaultValue) {
      getCurrentLocation();
    }
  }, [isLoaded, defaultValue, getCurrentLocation]);

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center space-x-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Loading map...</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={
          isLoadingLocation ? "Getting your location..." : "Enter location"
        }
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        ref={(input) => {
          if (input) {
            initAutocomplete(input);
          }
        }}
      />
      {isLoadingLocation && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      )}
    </div>
  );
}
