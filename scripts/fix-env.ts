/**
 * Fix .env file format
 * This script helps identify and fix DATABASE_URL format issues
 */

import * as fs from "fs";
import * as path from "path";

const envPath = path.join(process.cwd(), ".env");

function fixEnvFile() {
  console.log("=== Fixing .env file ===\n");

  if (!fs.existsSync(envPath)) {
    console.error("✗ .env file not found");
    console.log("Creating .env file from .env.example...");
    return;
  }

  const envContent = fs.readFileSync(envPath, "utf-8");
  const lines = envContent.split("\n");

  let fixed = false;
  const newLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
      if (line.startsWith("DATABASE_URL")) {
      // Check if the value includes the variable name (double definition)
      const urlMatch = line.match(/(postgresql?:\/\/[^\s"']+)/);
      
      if (urlMatch && urlMatch[1]) {
        const url = urlMatch[1];
        newLines.push(`DATABASE_URL="${url}"`);
        if (line !== `DATABASE_URL="${url}"`) {
          console.log(`✓ Fixed line ${i + 1}`);
          console.log(`  Before: ${line.substring(0, 80)}...`);
          console.log(`  After:  DATABASE_URL="${url.substring(0, 50)}..."`);
          fixed = true;
        } else {
          newLines.push(line);
        }
      } else {
        newLines.push(line);
        console.log(`⚠ Line ${i + 1} doesn't contain a valid PostgreSQL URL`);
        console.log(`  Content: ${line.substring(0, 80)}`);
      }
    } else {
      newLines.push(line);
    }
  }

  if (fixed) {
    const backupPath = envPath + ".backup";
    fs.writeFileSync(backupPath, envContent);
    console.log(`\n✓ Created backup: ${backupPath}`);
    
    fs.writeFileSync(envPath, newLines.join("\n"));
    console.log("✓ Updated .env file");
    console.log("\nPlease verify the DATABASE_URL is correct:");
    const dbLine = newLines.find((l) => l.startsWith("DATABASE_URL"));
    if (dbLine) {
      console.log("  " + dbLine);
    }
  } else {
    console.log("\n✓ .env file format looks correct");
    console.log("\nCurrent DATABASE_URL line:");
    const dbLine = lines.find((l) => l.trim().startsWith("DATABASE_URL"));
    if (dbLine) {
      console.log("  " + dbLine.trim());
    }
  }
}

fixEnvFile();
