using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;

namespace Server.Util;

public class EncryptionService
{
    private const int KeySize = 256; // AES-256
    private const int SaltSize = 16; // 128-bit salt
    private const int Iterations = 10000; // Number of iterations for PBKDF2

    public static string Encrypt(string plainText, string password)
    {
        // Generate a random salt
        var salt = GenerateRandomSalt();

        // Derive a key from the password and salt
        var key = DeriveKeyFromPassword(password, salt);

        using (var aes = Aes.Create())
        {
            aes.Key = key;
            aes.GenerateIV(); // Generate a random IV

            using (var encryptor = aes.CreateEncryptor(aes.Key, aes.IV))
            using (var ms = new MemoryStream())
            {
                // Write the salt and IV to the output stream
                ms.Write(salt, 0, salt.Length);
                ms.Write(aes.IV, 0, aes.IV.Length);

                using (var cs = new CryptoStream(ms, encryptor, CryptoStreamMode.Write))
                using (var sw = new StreamWriter(cs))
                {
                    sw.Write(plainText);
                }

                return Convert.ToBase64String(ms.ToArray());
            }
        }
    }

    public static string Decrypt(string cipherText, string password)
    {
        var fullCipher = Convert.FromBase64String(cipherText);

        // Extract the salt and IV from the cipher text
        var salt = new byte[SaltSize];
        Array.Copy(fullCipher, 0, salt, 0, SaltSize);

        var iv = new byte[16]; // AES block size is 16 bytes
        Array.Copy(fullCipher, SaltSize, iv, 0, iv.Length);

        // Derive the key from the password and extracted salt
        var key = DeriveKeyFromPassword(password, salt);

        using (var aes = Aes.Create())
        {
            aes.Key = key;
            aes.IV = iv;

            using (var decryptor = aes.CreateDecryptor(aes.Key, aes.IV))
            using (var ms = new MemoryStream(fullCipher, SaltSize + iv.Length, fullCipher.Length - SaltSize - iv.Length))
            using (var cs = new CryptoStream(ms, decryptor, CryptoStreamMode.Read))
            using (var sr = new StreamReader(cs))
            {
                return sr.ReadToEnd();
            }
        }
    }

    private static byte[] GenerateRandomSalt()
    {
        var salt = new byte[SaltSize];
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(salt);
        }
        return salt;
    }

    private static byte[] DeriveKeyFromPassword(string password, byte[] salt)
    {
        using (var pbkdf2 = new Rfc2898DeriveBytes(password, salt, iterations: Iterations, hashAlgorithm: HashAlgorithmName.SHA256))
        {
            return pbkdf2.GetBytes(KeySize / 8); // Convert bits to bytes
        }
    }
}