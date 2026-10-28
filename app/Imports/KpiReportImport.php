<?php

namespace App\Imports;

use App\Models\Kpi;
use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithUpserts;
use PhpOffice\PhpSpreadsheet\Shared\Date as ExcelDate;

class KpiReportImport implements ToModel, WithBatchInserts, WithChunkReading, WithHeadingRow, WithUpserts
{
    public function model(array $row): ?Kpi
    {
        $jobNo = $this->str($row['jobno'] ?? null);
        $daikinDo = $this->str($row['daikin_do'] ?? null);

        // skip blank rows (both parts of the unique key are required)
        if ($jobNo === null || $daikinDo === null) {
            return null;
        }

        return new Kpi([
            'truck_load_no' => $this->str($row['truckloadno'] ?? null),
            'job_no' => $jobNo,
            'job_date' => $this->date($row['jobdate'] ?? null, 'Y-m-d'),
            'daikin_do' => $daikinDo,
            'delivery_point_name' => $this->str($row['deliverypointname'] ?? null),
            'truck_no' => $this->str($row['truckno'] ?? null),
            'iod_date' => $this->date($row['ioddate'] ?? null, 'Y-m-d H:i:s'),
            'est_delivery_date' => $this->date($row['estdeliverydate'] ?? null, 'Y-m-d'),
            'est_delivery_time' => $this->str($row['estdeliverytime'] ?? null),
            'kpi_pass' => $this->str($row['kpi_pass'] ?? null),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    // Must match the DB unique index exactly
    public function uniqueBy(): array
    {
        return ['job_no', 'daikin_do'];
    }

    // On conflict, update everything except the key and created_at
    public function upsertColumns(): array
    {
        return [
            'truck_load_no', 'job_date', 'delivery_point_name', 'truck_no',
            'iod_date', 'est_delivery_date', 'est_delivery_time', 'kpi_pass',
            'updated_at',
        ];
    }

    public function batchSize(): int
    {
        return 500;
    }

    public function chunkSize(): int
    {
        return 500;
    }

    private function str(mixed $value): ?string
    {
        if ($value === null) {
            return null;
        }

        // avoid 8.02131067E+8 for numeric cells
        if (is_float($value) && floor($value) == $value) {
            $value = (int) $value;
        }

        $value = trim((string) $value);

        return $value === '' ? null : $value;
    }

    private function date(mixed $value, string $format): ?string
    {
        if ($value === null || $value === '') {
            return null;
        }

        try {
            if (is_numeric($value)) {
                return Carbon::instance(ExcelDate::excelToDateTimeObject($value))->format($format);
            }

            return Carbon::parse($value)->format($format);
        } catch (\Throwable) {
            return null;
        }
    }
}
