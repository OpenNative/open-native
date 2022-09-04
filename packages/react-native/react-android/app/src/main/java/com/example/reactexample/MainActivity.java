package com.example.reactexample;

import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

import com.bridge.Bridge;

public class MainActivity extends AppCompatActivity {
    // Just adding it here so it does not get removed.
    private Bridge bridge;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        bridge = new Bridge();
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }
}
