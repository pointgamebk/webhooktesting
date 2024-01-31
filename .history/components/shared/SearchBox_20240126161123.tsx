import { useGoogleMapsScript, Libraries } from "use-google-maps-script";

interface ISearchBoxProps {
  onSelectAddress: (
    address: string,
    latitude: number | null,
    longitude: number | null
  ) => void;
  defaultValue: string;
}

const SearchBox = ({ onSelectAddress, defaultValue }: ISearchBoxProps) => {
  //   const { isLoaded } = useGoogleMapsScript({
  //     googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
  //     libraries,
  //   });
  return <div>SearchBox</div>;
};

export default SearchBox;
