import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { fetchCountries } from "../countries/countriesSlice";
import { semiFinalOptions } from "../../utils/constants";
import { showResponse } from "../ui/uiSlice";
import { api } from "../../services/axios";

export default function ParticipantForm() {
  const dispatch = useAppDispatch();
  const countries = useAppSelector((state) => state.countries.items);

  const [form, setForm] = useState({
    participantName: "",
    songName: "",
    edition: "",
    semiFinal: "s1",
    country: "",
  });

  useEffect(() => {
    dispatch(fetchCountries());
  }, [dispatch]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.post("/admin/createParticipant", {
        ...form,
        edition: Number(form.edition),
      });

      dispatch(
        showResponse({
          open: true,
          type: "success",
          title: "Uğurlu",
          message: "Participant uğurla yaradıldı",
        })
      );
    } catch (error) {
      dispatch(
        showResponse({
          open: true,
          type: "error",
          title: "Xəta",
          message: "Participant yaradılmadı",
        })
      );
    }
  };

  return (
    <form onSubmit={submitForm} className="grid gap-4 rounded-2xl bg-white p-6 shadow">
      <input
        name="participantName"
        value={form.participantName}
        onChange={handleChange}
        placeholder="Participant adı"
        className="rounded-xl border px-4 py-3"
      />

      <input
        name="songName"
        value={form.songName}
        onChange={handleChange}
        placeholder="Mahnı adı"
        className="rounded-xl border px-4 py-3"
      />

      <input
        name="edition"
        type="number"
        value={form.edition}
        onChange={handleChange}
        placeholder="Edition"
        className="rounded-xl border px-4 py-3"
      />

      <select
        name="semiFinal"
        value={form.semiFinal}
        onChange={handleChange}
        className="rounded-xl border px-4 py-3"
      >
        {semiFinalOptions.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>

      <select
        name="country"
        value={form.country}
        onChange={handleChange}
        className="rounded-xl border px-4 py-3"
      >
        <option value="">Ölkə seç</option>
        {countries.map((country) => (
          <option key={country._id} value={country._id}>
            {country.countryName}
          </option>
        ))}
      </select>

      <button className="rounded-xl bg-violet-600 px-4 py-3 font-semibold text-white hover:bg-violet-700">
        Yadda saxla
      </button>
    </form>
  );
}