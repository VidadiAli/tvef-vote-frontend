import { useEffect, useState } from "react";
import { api } from "../services/axios";
import { useAppDispatch } from "../hooks/redux";
import { showResponse } from "../features/ui/uiSlice";
import type { Country } from "../types/country";
import { Pencil, Trash2 } from "lucide-react";
import MainPageLoadings from "../loadings/MainPageLoadings";
import DeleteElement from "../loadings/DeleteElement";

export default function AdminCountriesPage() {
    const dispatch = useAppDispatch();

    const [form, setForm] = useState({
        countryName: "",
        countryImageUrl: "",
    });

    const [countries, setCountries] = useState<Country[]>([])
    const [editCountry, setEditCountry] = useState<String>("");
    const [mainLoading, setMainLoading] = useState(false)
    const [loading, setLoading] = useState(false);
    const [deleteItemLoading, setDeleteItemLoading] = useState(false)
    const [deletingElementIndex, setDeletingElementIndex] = useState<Number>(-1);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const submitForm = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);

            const res = editCountry ?
                await api.patch(`/country/updateCountryById/${editCountry}`, form) :
                await api.post('/country/addCountry', form)

            dispatch(
                showResponse({
                    open: true,
                    type: "success",
                    title: "Uğurlu",
                    message: editCountry ? "Country updated!" : "Country created!",
                })
            );

            setForm({
                countryName: "",
                countryImageUrl: "",
            });

            setEditCountry("");
            setCountries(res?.data?.newData);
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

    const getAllCountries = async () => {
        try {
            setMainLoading(true)
            const res = await api.get<Country[]>('/country/getAllCountries');
            setCountries(res?.data);
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
        finally {
            setMainLoading(false)
        }
    }

    const handleEdit = async (country: Country) => {
        setForm({
            countryName: country.countryName,
            countryImageUrl: country.countryImageUrl
        })
        setEditCountry(country._id)
    };

    const handleDelete = async (id: string, index: number) => {
        try {
            setDeleteItemLoading(true)
            setDeletingElementIndex(index)
            const res = await api.delete(`/country/deleteCountryById/${id}`);
            setCountries(res?.data?.newData)
        }
        catch (error: any) {
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
        getAllCountries()
    }, []);

    if (mainLoading) {
        return <MainPageLoadings />
    }

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Countries</h1>
                <p className="mt-1 text-sm text-slate-500">
                    Yeni ölkə əlavə et.
                </p>
            </div>

            <form
                onSubmit={submitForm}
                className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 md:grid-cols-2"
            >
                <input
                    name="countryName"
                    value={form.countryName}
                    onChange={handleChange}
                    placeholder="Country name"
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-violet-400"
                />

                <input
                    name="countryImageUrl"
                    value={form.countryImageUrl}
                    onChange={handleChange}
                    placeholder="Country image url"
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-violet-400"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-xl bg-violet-600 px-4 py-3 font-semibold text-white transition hover:bg-violet-700 disabled:opacity-60"
                >
                    {loading ? editCountry ? "Updating..." : "Creating..." : editCountry ? "Updated" : "Create Country"}
                </button>
            </form>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {countries.map((country, index) => (
                    deleteItemLoading && index == deletingElementIndex ? <DeleteElement /> :
                        <div
                            key={country._id}
                            className="group rounded-2xl border border-emerald-200 bg-white p-4 text-center shadow-sm transition duration-200 hover:-translate-y-1 hover:border-emerald-400 hover:shadow-lg"
                        >
                            <img
                                src={country.countryImageUrl}
                                alt={country.countryName}
                                className="mx-auto mb-3 h-20 w-20 rounded-full object-cover ring-2 ring-transparent transition group-hover:ring-emerald-300"
                            />

                            <span className="mb-3 block text-sm font-semibold text-gray-800">
                                {country.countryName}
                            </span>

                            <div className="flex justify-center gap-3">
                                <button
                                    onClick={() => handleEdit(country)}
                                    className="rounded-lg p-2 text-emerald-600 transition hover:bg-emerald-100"
                                >
                                    <Pencil size={18} />
                                </button>

                                <button
                                    onClick={() => handleDelete(country._id, index)}
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