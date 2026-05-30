<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('seller_verifications', function (Blueprint $table) {
            if (!Schema::hasColumn('seller_verifications', 'foto_selfie')) {
                $table->string('foto_selfie')->after('foto_ktm')->comment('path to uploaded KYC selfie image');
            }
        });
    }

    public function down(): void
    {
        Schema::table('seller_verifications', function (Blueprint $table) {
            if (Schema::hasColumn('seller_verifications', 'foto_selfie')) {
                $table->dropColumn('foto_selfie');
            }
        });
    }
};
