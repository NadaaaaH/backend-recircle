<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProductController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});
Route::get('/product/{id}', [ProductController::class, 'show'])->name('product.show');
Route::get('/explore', [ProductController::class, 'index'])->name('product.index');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::middleware('auth')->group(function () {
        Route::get('/jual', [ProductController::class, 'create'])->name('product.create');
        Route::post('/jual', [ProductController::class, 'store'])->name('product.store');
        Route::get('/seller/register', function () {
            return Inertia::render('Seller/Register');
        })->name('seller.register');

        Route::get('/seller/dashboard', function () {
            return Inertia::render('Seller/Dashboard');
        })->name('seller.dashboard');
        Route::get('/seller/products', function () {
            return Inertia::render('Seller/Products');
        })->name('products.index');

        Route::get('/seller/orders', function () {
            return Inertia::render('Seller/Orders');
        })->name('orders.index');

        Route::get('/seller/finance', function () {
            return Inertia::render('Seller/Finance');
        })->name('finance.index');

        Route::get('/seller/settings', function () {
            return Inertia::render('Seller/Settings');
        })->name('settings');
    });
});

require __DIR__ . '/auth.php';
