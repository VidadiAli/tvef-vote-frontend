import { useEffect, useState } from "react";
import { api } from "../services/axios";
import { useAppDispatch } from "../hooks/redux";
import { showResponse } from "../features/ui/uiSlice";
import { semiFinalOptions } from "../utils/constants";
import type { Country } from "../types/country";
import type { Participant } from "../types/participant";
import { Pencil, Trash2 } from "lucide-react";
import DeleteElement from "../loadings/DeleteElement";
import MainPageLoadings from "../loadings/MainPageLoadings";

export default function AdminParticipantsPage() {
    const dispatch = useAppDispatch();

    const [countries, setCountries] = useState<Country[]>([]);
    const [countriesLoading, setCountriesLoading] = useState(false);
    const [loading, setLoading] = useState(false);

    const [participants, setParticipants] = useState<Participant[]>([])
    const [editParticipant, setEditParticipant] = useState<String>("");
    const [deleteItemLoading, setDeleteItemLoading] = useState(false)
    const [mainLoading, setMainLoading] = useState(false)
    const [deletingElementIndex, setDeletingElementIndex] = useState<Number>(-1);

    const [form, setForm] = useState({
        participantName: "",
        hasYoutubeLink: false,
        youtubeLink: "",
        country: "",
        semiFinal: "s1",
        edition: 11,
    });

    const fetchCountries = async () => {
        try {
            setCountriesLoading(true);
            const res = await api.get("/country/getAllCountries");
            setCountries(res?.data || []);
        } catch (error) {
            dispatch(
                showResponse({
                    open: true,
                    type: "error",
                    title: "Xəta",
                    message: "Ölkələr gətirilə bilmədi",
                })
            );
        } finally {
            setCountriesLoading(false);
        }
    };

    useEffect(() => {
        fetchCountries();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;

        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;

            setForm((prev) => ({
                ...prev,
                [name]: checked,
                ...(name === "hasYoutubeLink" && !checked ? { youtubeLink: "" } : {}),
            }));
            return;
        }

        setForm((prev) => ({
            ...prev,
            [name]: name === "edition" ? Number(value) : value,
        }));
    };

    const submitForm = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);

            const payload = {
                participantName: form.participantName,
                hasYoutubeLink: form.hasYoutubeLink,
                youtubeLink: form.hasYoutubeLink ? form.youtubeLink : "",
                country: form.country,
                semiFinal: form.semiFinal,
                edition: Number(form.edition),
            };

            const res = editParticipant
                ? await api.patch(`/participant/updateParticipantById/${editParticipant}`, payload)
                : await api.post("/participant/addParticipant", payload);

            dispatch(
                showResponse({
                    open: true,
                    type: "success",
                    title: "Uğurlu",
                    message: editParticipant
                        ? "Participant updated!"
                        : "Participant created!",
                })
            );

            setForm({
                participantName: "",
                hasYoutubeLink: false,
                youtubeLink: "",
                country: "",
                semiFinal: "s1",
                edition: 11,
            });

            setEditParticipant("");
            setParticipants(res?.data?.newData);
        } catch (error: any) {
            dispatch(
                showResponse({
                    open: true,
                    type: "error",
                    title: "Xəta",
                    message: error.response?.data?.message || "Server xətası",
                })
            );
        } finally {
            setLoading(false);
        }
    };

    const getAllParticipants = async () => {
        try {
            setMainLoading(true)
            const res = await api.get<Participant[]>('/participant/getAllParticipants');
            setParticipants(res?.data);

        } catch (error) {
            dispatch(
                showResponse({
                    open: true,
                    type: "error",
                    title: "Xəta",
                    message: "message",
                })
            );
        }
        finally{
            setMainLoading(false)
        }
    }

    const handleEdit = async (participant: Participant) => {
        setForm({
            participantName: participant.participantName,
            hasYoutubeLink: participant.hasYoutubeLink,
            youtubeLink: participant.youtubeLink,
            country: participant.country._id,
            semiFinal: participant.semiFinal,
            edition: participant.edition,
        })
        setEditParticipant(participant._id)
    };

    const handleDelete = async (id: string, index: number) => {
        try {
            setDeleteItemLoading(true)
            setDeletingElementIndex(index)
            const res = await api.delete(`/participant/deleteParticipantById/${id}`);
            setParticipants(res?.data?.newData)
        } catch (error: any) {
            dispatch(
                showResponse({
                    open: true,
                    type: "error",
                    title: "Xəta",
                    message: error.response?.data?.message || "Server xətası",
                })
            );
        }
        finally {
            setDeleteItemLoading(false)
            setDeletingElementIndex(-1)
        }
    };

    useEffect(() => {
        getAllParticipants()
    }, []);

    if (mainLoading) {
        return <MainPageLoadings />
    }


    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Participants</h1>
                <p className="mt-1 text-sm text-slate-500">
                    Yeni iştirakçı əlavə et.
                </p>
            </div>

            <form
                onSubmit={submitForm}
                className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 md:grid-cols-2"
            >
                <input
                    name="participantName"
                    value={form.participantName}
                    onChange={handleChange}
                    placeholder="Participant name"
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-violet-400"
                />

                <input
                    name="edition"
                    type="number"
                    value={form.edition}
                    onChange={handleChange}
                    placeholder="Edition"
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-violet-400"
                />

                <select
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-violet-400"
                >
                    <option value="">
                        {countriesLoading ? "Ölkələr yüklənir..." : "Ölkə seç"}
                    </option>
                    {countries.map((country) => (
                        <option key={country._id} value={country._id}>
                            {country.countryName}
                        </option>
                    ))}
                </select>

                <select
                    name="semiFinal"
                    value={form.semiFinal}
                    onChange={handleChange}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-violet-400"
                >
                    {semiFinalOptions.map((semi) => (
                        <option key={semi.value} value={semi.value}>
                            {semi.label}
                        </option>
                    ))}
                </select>

                <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 md:col-span-2">
                    <input
                        type="checkbox"
                        name="hasYoutubeLink"
                        checked={form.hasYoutubeLink}
                        onChange={handleChange}
                        className="h-4 w-4"
                    />
                    <span className="text-sm font-medium text-slate-700">
                        Youtube videosu var
                    </span>
                </label>

                {form.hasYoutubeLink && (
                    <input
                        name="youtubeLink"
                        value={form.youtubeLink}
                        onChange={handleChange}
                        placeholder="Youtube link"
                        className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-violet-400 md:col-span-2"
                    />
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-xl bg-violet-600 px-4 py-3 font-semibold text-white transition hover:bg-violet-700 disabled:opacity-60 md:col-span-2"
                >
                    {loading
                        ? editParticipant
                            ? "Updating..."
                            : "Creating..."
                        : editParticipant
                            ? "Update Participant"
                            : "Create Participant"}
                </button>
            </form>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {participants.map((participant, index) => (
                    deleteItemLoading && index == deletingElementIndex ? <DeleteElement /> :
                        <div
                            key={participant._id}
                            className="group rounded-2xl border border-emerald-200 bg-white p-4 text-center shadow-sm transition duration-200 hover:-translate-y-1 hover:border-emerald-400 hover:shadow-lg"
                        >
                            <img
                                src={participant.country.countryImageUrl}
                                alt={participant.country.countryName}
                                className="mx-auto mb-3 h-20 w-20 rounded-full object-cover ring-2 ring-transparent transition group-hover:ring-emerald-300"
                            />

                            <span className="block text-sm font-semibold text-gray-800">
                                {participant.participantName}
                            </span>

                            <span className="mb-3 block text-xs text-gray-500">
                                {participant.country.countryName}
                            </span>

                            <div className="flex justify-center gap-3">
                                <button
                                    onClick={() => handleEdit(participant)}
                                    className="rounded-lg p-2 text-emerald-600 transition hover:bg-emerald-100"
                                >
                                    <Pencil size={18} />
                                </button>

                                <button
                                    onClick={() => handleDelete(participant._id, index)}
                                    className="rounded-lg p-2 text-red-500 transition hover:bg-red-100"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                ))}
            </div>
        </div>
    );
}