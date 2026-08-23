import * as $Enums from "./enums.js";
import type * as Prisma from "./internal/prismaNamespace.js";
export type UuidFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    mode?: Prisma.QueryMode;
    not?: Prisma.NestedUuidFilter<$PrismaModel> | string;
};
export type StringFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    mode?: Prisma.QueryMode;
    not?: Prisma.NestedStringFilter<$PrismaModel> | string;
};
export type EnumPeranFilter<$PrismaModel = never> = {
    equals?: $Enums.Peran | Prisma.EnumPeranFieldRefInput<$PrismaModel>;
    in?: $Enums.Peran[] | Prisma.ListEnumPeranFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Peran[] | Prisma.ListEnumPeranFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumPeranFilter<$PrismaModel> | $Enums.Peran;
};
export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    mode?: Prisma.QueryMode;
    not?: Prisma.NestedStringNullableFilter<$PrismaModel> | string | null;
};
export type SortOrderInput = {
    sort: Prisma.SortOrder;
    nulls?: Prisma.NullsOrder;
};
export type UuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    mode?: Prisma.QueryMode;
    not?: Prisma.NestedUuidWithAggregatesFilter<$PrismaModel> | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedStringFilter<$PrismaModel>;
    _max?: Prisma.NestedStringFilter<$PrismaModel>;
};
export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    mode?: Prisma.QueryMode;
    not?: Prisma.NestedStringWithAggregatesFilter<$PrismaModel> | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedStringFilter<$PrismaModel>;
    _max?: Prisma.NestedStringFilter<$PrismaModel>;
};
export type EnumPeranWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Peran | Prisma.EnumPeranFieldRefInput<$PrismaModel>;
    in?: $Enums.Peran[] | Prisma.ListEnumPeranFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Peran[] | Prisma.ListEnumPeranFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumPeranWithAggregatesFilter<$PrismaModel> | $Enums.Peran;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumPeranFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumPeranFilter<$PrismaModel>;
};
export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    mode?: Prisma.QueryMode;
    not?: Prisma.NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedStringNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedStringNullableFilter<$PrismaModel>;
};
export type EnumJenisKerusakanFilter<$PrismaModel = never> = {
    equals?: $Enums.JenisKerusakan | Prisma.EnumJenisKerusakanFieldRefInput<$PrismaModel>;
    in?: $Enums.JenisKerusakan[] | Prisma.ListEnumJenisKerusakanFieldRefInput<$PrismaModel>;
    notIn?: $Enums.JenisKerusakan[] | Prisma.ListEnumJenisKerusakanFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumJenisKerusakanFilter<$PrismaModel> | $Enums.JenisKerusakan;
};
export type EnumTingkatBahayaFilter<$PrismaModel = never> = {
    equals?: $Enums.TingkatBahaya | Prisma.EnumTingkatBahayaFieldRefInput<$PrismaModel>;
    in?: $Enums.TingkatBahaya[] | Prisma.ListEnumTingkatBahayaFieldRefInput<$PrismaModel>;
    notIn?: $Enums.TingkatBahaya[] | Prisma.ListEnumTingkatBahayaFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumTingkatBahayaFilter<$PrismaModel> | $Enums.TingkatBahaya;
};
export type IntFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntFilter<$PrismaModel> | number;
};
export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBoolFilter<$PrismaModel> | boolean;
};
export type EnumStatusLaporanFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusLaporan | Prisma.EnumStatusLaporanFieldRefInput<$PrismaModel>;
    in?: $Enums.StatusLaporan[] | Prisma.ListEnumStatusLaporanFieldRefInput<$PrismaModel>;
    notIn?: $Enums.StatusLaporan[] | Prisma.ListEnumStatusLaporanFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumStatusLaporanFilter<$PrismaModel> | $Enums.StatusLaporan;
};
export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeFilter<$PrismaModel> | Date | string;
};
export type EnumJenisKerusakanWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.JenisKerusakan | Prisma.EnumJenisKerusakanFieldRefInput<$PrismaModel>;
    in?: $Enums.JenisKerusakan[] | Prisma.ListEnumJenisKerusakanFieldRefInput<$PrismaModel>;
    notIn?: $Enums.JenisKerusakan[] | Prisma.ListEnumJenisKerusakanFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumJenisKerusakanWithAggregatesFilter<$PrismaModel> | $Enums.JenisKerusakan;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumJenisKerusakanFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumJenisKerusakanFilter<$PrismaModel>;
};
export type EnumTingkatBahayaWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TingkatBahaya | Prisma.EnumTingkatBahayaFieldRefInput<$PrismaModel>;
    in?: $Enums.TingkatBahaya[] | Prisma.ListEnumTingkatBahayaFieldRefInput<$PrismaModel>;
    notIn?: $Enums.TingkatBahaya[] | Prisma.ListEnumTingkatBahayaFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumTingkatBahayaWithAggregatesFilter<$PrismaModel> | $Enums.TingkatBahaya;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumTingkatBahayaFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumTingkatBahayaFilter<$PrismaModel>;
};
export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntWithAggregatesFilter<$PrismaModel> | number;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _avg?: Prisma.NestedFloatFilter<$PrismaModel>;
    _sum?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedIntFilter<$PrismaModel>;
    _max?: Prisma.NestedIntFilter<$PrismaModel>;
};
export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedBoolFilter<$PrismaModel>;
    _max?: Prisma.NestedBoolFilter<$PrismaModel>;
};
export type EnumStatusLaporanWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusLaporan | Prisma.EnumStatusLaporanFieldRefInput<$PrismaModel>;
    in?: $Enums.StatusLaporan[] | Prisma.ListEnumStatusLaporanFieldRefInput<$PrismaModel>;
    notIn?: $Enums.StatusLaporan[] | Prisma.ListEnumStatusLaporanFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumStatusLaporanWithAggregatesFilter<$PrismaModel> | $Enums.StatusLaporan;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumStatusLaporanFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumStatusLaporanFilter<$PrismaModel>;
};
export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedDateTimeFilter<$PrismaModel>;
    _max?: Prisma.NestedDateTimeFilter<$PrismaModel>;
};
export type EnumStatusLaporanNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusLaporan | Prisma.EnumStatusLaporanFieldRefInput<$PrismaModel> | null;
    in?: $Enums.StatusLaporan[] | Prisma.ListEnumStatusLaporanFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.StatusLaporan[] | Prisma.ListEnumStatusLaporanFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumStatusLaporanNullableFilter<$PrismaModel> | $Enums.StatusLaporan | null;
};
export type EnumStatusLaporanNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusLaporan | Prisma.EnumStatusLaporanFieldRefInput<$PrismaModel> | null;
    in?: $Enums.StatusLaporan[] | Prisma.ListEnumStatusLaporanFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.StatusLaporan[] | Prisma.ListEnumStatusLaporanFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumStatusLaporanNullableWithAggregatesFilter<$PrismaModel> | $Enums.StatusLaporan | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumStatusLaporanNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumStatusLaporanNullableFilter<$PrismaModel>;
};
export type NestedUuidFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedUuidFilter<$PrismaModel> | string;
};
export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedStringFilter<$PrismaModel> | string;
};
export type NestedEnumPeranFilter<$PrismaModel = never> = {
    equals?: $Enums.Peran | Prisma.EnumPeranFieldRefInput<$PrismaModel>;
    in?: $Enums.Peran[] | Prisma.ListEnumPeranFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Peran[] | Prisma.ListEnumPeranFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumPeranFilter<$PrismaModel> | $Enums.Peran;
};
export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedStringNullableFilter<$PrismaModel> | string | null;
};
export type NestedUuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedUuidWithAggregatesFilter<$PrismaModel> | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedStringFilter<$PrismaModel>;
    _max?: Prisma.NestedStringFilter<$PrismaModel>;
};
export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntFilter<$PrismaModel> | number;
};
export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedStringWithAggregatesFilter<$PrismaModel> | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedStringFilter<$PrismaModel>;
    _max?: Prisma.NestedStringFilter<$PrismaModel>;
};
export type NestedEnumPeranWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Peran | Prisma.EnumPeranFieldRefInput<$PrismaModel>;
    in?: $Enums.Peran[] | Prisma.ListEnumPeranFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Peran[] | Prisma.ListEnumPeranFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumPeranWithAggregatesFilter<$PrismaModel> | $Enums.Peran;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumPeranFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumPeranFilter<$PrismaModel>;
};
export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedStringNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedStringNullableFilter<$PrismaModel>;
};
export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntNullableFilter<$PrismaModel> | number | null;
};
export type NestedEnumJenisKerusakanFilter<$PrismaModel = never> = {
    equals?: $Enums.JenisKerusakan | Prisma.EnumJenisKerusakanFieldRefInput<$PrismaModel>;
    in?: $Enums.JenisKerusakan[] | Prisma.ListEnumJenisKerusakanFieldRefInput<$PrismaModel>;
    notIn?: $Enums.JenisKerusakan[] | Prisma.ListEnumJenisKerusakanFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumJenisKerusakanFilter<$PrismaModel> | $Enums.JenisKerusakan;
};
export type NestedEnumTingkatBahayaFilter<$PrismaModel = never> = {
    equals?: $Enums.TingkatBahaya | Prisma.EnumTingkatBahayaFieldRefInput<$PrismaModel>;
    in?: $Enums.TingkatBahaya[] | Prisma.ListEnumTingkatBahayaFieldRefInput<$PrismaModel>;
    notIn?: $Enums.TingkatBahaya[] | Prisma.ListEnumTingkatBahayaFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumTingkatBahayaFilter<$PrismaModel> | $Enums.TingkatBahaya;
};
export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBoolFilter<$PrismaModel> | boolean;
};
export type NestedEnumStatusLaporanFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusLaporan | Prisma.EnumStatusLaporanFieldRefInput<$PrismaModel>;
    in?: $Enums.StatusLaporan[] | Prisma.ListEnumStatusLaporanFieldRefInput<$PrismaModel>;
    notIn?: $Enums.StatusLaporan[] | Prisma.ListEnumStatusLaporanFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumStatusLaporanFilter<$PrismaModel> | $Enums.StatusLaporan;
};
export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeFilter<$PrismaModel> | Date | string;
};
export type NestedEnumJenisKerusakanWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.JenisKerusakan | Prisma.EnumJenisKerusakanFieldRefInput<$PrismaModel>;
    in?: $Enums.JenisKerusakan[] | Prisma.ListEnumJenisKerusakanFieldRefInput<$PrismaModel>;
    notIn?: $Enums.JenisKerusakan[] | Prisma.ListEnumJenisKerusakanFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumJenisKerusakanWithAggregatesFilter<$PrismaModel> | $Enums.JenisKerusakan;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumJenisKerusakanFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumJenisKerusakanFilter<$PrismaModel>;
};
export type NestedEnumTingkatBahayaWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TingkatBahaya | Prisma.EnumTingkatBahayaFieldRefInput<$PrismaModel>;
    in?: $Enums.TingkatBahaya[] | Prisma.ListEnumTingkatBahayaFieldRefInput<$PrismaModel>;
    notIn?: $Enums.TingkatBahaya[] | Prisma.ListEnumTingkatBahayaFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumTingkatBahayaWithAggregatesFilter<$PrismaModel> | $Enums.TingkatBahaya;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumTingkatBahayaFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumTingkatBahayaFilter<$PrismaModel>;
};
export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntWithAggregatesFilter<$PrismaModel> | number;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _avg?: Prisma.NestedFloatFilter<$PrismaModel>;
    _sum?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedIntFilter<$PrismaModel>;
    _max?: Prisma.NestedIntFilter<$PrismaModel>;
};
export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedFloatFilter<$PrismaModel> | number;
};
export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedBoolFilter<$PrismaModel>;
    _max?: Prisma.NestedBoolFilter<$PrismaModel>;
};
export type NestedEnumStatusLaporanWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusLaporan | Prisma.EnumStatusLaporanFieldRefInput<$PrismaModel>;
    in?: $Enums.StatusLaporan[] | Prisma.ListEnumStatusLaporanFieldRefInput<$PrismaModel>;
    notIn?: $Enums.StatusLaporan[] | Prisma.ListEnumStatusLaporanFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumStatusLaporanWithAggregatesFilter<$PrismaModel> | $Enums.StatusLaporan;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumStatusLaporanFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumStatusLaporanFilter<$PrismaModel>;
};
export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedDateTimeFilter<$PrismaModel>;
    _max?: Prisma.NestedDateTimeFilter<$PrismaModel>;
};
export type NestedEnumStatusLaporanNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusLaporan | Prisma.EnumStatusLaporanFieldRefInput<$PrismaModel> | null;
    in?: $Enums.StatusLaporan[] | Prisma.ListEnumStatusLaporanFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.StatusLaporan[] | Prisma.ListEnumStatusLaporanFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumStatusLaporanNullableFilter<$PrismaModel> | $Enums.StatusLaporan | null;
};
export type NestedEnumStatusLaporanNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusLaporan | Prisma.EnumStatusLaporanFieldRefInput<$PrismaModel> | null;
    in?: $Enums.StatusLaporan[] | Prisma.ListEnumStatusLaporanFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.StatusLaporan[] | Prisma.ListEnumStatusLaporanFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumStatusLaporanNullableWithAggregatesFilter<$PrismaModel> | $Enums.StatusLaporan | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumStatusLaporanNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumStatusLaporanNullableFilter<$PrismaModel>;
};
