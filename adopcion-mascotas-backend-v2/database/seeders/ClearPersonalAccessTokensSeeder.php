<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ClearPersonalAccessTokensSeeder extends Seeder
{
    public function run()
    {
        DB::table('personal_access_tokens')->truncate();
    }
}
