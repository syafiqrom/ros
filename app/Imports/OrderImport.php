<?php

namespace App\Imports;

use App\Models\Order;
use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithUpsertColumns;
use Maatwebsite\Excel\Concerns\WithUpserts;
use PhpOffice\PhpSpreadsheet\Shared\Date;

class OrderImport implements ToModel, WithBatchInserts, WithChunkReading, WithHeadingRow, WithUpsertColumns, WithUpserts
{
    public function model(array $row): ?Order
    {
        $data = [
            'vbeln' => $this->str($row['vbeln'] ?? null),
            'pdate' => $this->date($row['pdate'] ?? null, 'Y-m-d'),
            'name' => $this->str($row['name'] ?? null),
            'addr1' => $this->str($row['addr1'] ?? null),
            'addr2' => $this->str($row['addr2'] ?? null),
            'city' => $this->str($row['city'] ?? null),
            'region' => $this->str($row['region'] ?? null),
            'tzone' => $this->str($row['tzone'] ?? null),
            'volum' => $row['volum'] ?? null,
        ];

        // skip fully empty rows
        if (! array_filter($data, fn ($v) => $v !== null)) {
            return null;
        }

        return new Order($data + [
            'plan_board' => $data['tzone'], // initial lane
            'row_hash' => sha1(json_encode($data)),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function uniqueBy(): string
    {
        return 'row_hash';
    }

    /**
     * Columns to update when a duplicate hash is found.
     * Since the hash covers all data columns, only updated_at needs touching,
     * and created_at is preserved.
     */
    public function upsertColumns(): array
    {
        return ['updated_at'];
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

        // numeric cells can arrive as 20261104 or 20261104.0
        if (is_float($value) && floor($value) == $value) {
            $value = (int) $value;
        }

        $string = trim((string) $value);

        // expected format: yyyymmdd
        if (preg_match('/^\d{8}$/', $string)) {
            try {
                return Carbon::createFromFormat('Ymd', $string)->format($format);
            } catch (\Throwable) {
                return null;
            }
        }

        // fallback: a real Excel date-formatted cell (serial like 46330)
        if (is_numeric($value) && $value > 0 && $value < 100000) {
            return Date::excelToDateTimeObject($value)->format($format);
        }

        return null;
    }
}
